<?php
/* ═══════════════════════════════════════════════════════════════════════
   TRAITEMENT DU FORMULAIRE DE CONTACT
   Portfolio Mercia RANDRIANOME

   Ce fichier remplace le service FormSubmit. Il tourne sur le serveur, donc
   l'adresse de destination n'apparaît jamais dans le code source de la page.

   Il envoie deux mails :
     1. la demande, vers la boîte de Mercia
     2. un accusé de réception, vers la personne qui a écrit

   Les deux sont en HTML, avec une version texte pour les messageries qui
   n'affichent pas le HTML.
   ═══════════════════════════════════════════════════════════════════════ */

// ── Réglages ──────────────────────────────────────────────────────────
$DESTINATAIRE   = 'randrianomemercia@gmail.com';
$EXPEDITEUR     = 'portfolio@ikala-ni.fr';   // adresse technique sur le domaine
$NOM_EXPEDITEUR = 'Portfolio Mercia';
$SITE           = 'https://portfolio-mercia.ikala-ni.fr';
$PAGE_CONTACT   = $SITE . '/contact.html';

// ── Utilitaires ───────────────────────────────────────────────────────

/** Renvoie vers la page de contact avec un code de résultat, puis stoppe. */
function retour($code)
{
    global $PAGE_CONTACT;
    header('Location: ' . $PAGE_CONTACT . '?' . $code);
    exit;
}

/** Nettoie une valeur de formulaire : supprime les retours à la ligne
 *  (protection contre l'injection d'en-têtes mail) et limite la longueur. */
function propre($valeur, $limite = 200)
{
    $valeur = is_string($valeur) ? $valeur : '';
    $valeur = str_replace(["\r", "\n", "%0a", "%0d"], ' ', $valeur);
    return mb_substr(trim($valeur), 0, $limite);
}

/** Échappe pour affichage dans du HTML. */
function h($valeur)
{
    return htmlspecialchars($valeur, ENT_QUOTES, 'UTF-8');
}

// ── Contrôles d'entrée ────────────────────────────────────────────────

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    retour('erreur=methode');
}

// Le champ piège est invisible pour un humain : s'il est rempli, c'est un robot.
if (!empty($_POST['_honey'])) {
    retour('envoye=1'); // on fait comme si tout allait bien
}

$nom     = propre($_POST['nom'] ?? '', 120);
$email   = propre($_POST['email'] ?? '', 180);
$service = propre($_POST['service'] ?? '', 80);
$message = trim($_POST['message'] ?? '');
$message = mb_substr($message, 0, 5000);

if ($nom === '' || $email === '' || $message === '') {
    retour('erreur=champs');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    retour('erreur=email');
}
if ($service === '') {
    $service = 'Non précisé';
}

// Garde-fou simple : pas plus d'un envoi toutes les 30 secondes par visiteur.
$empreinte = sys_get_temp_dir() . '/contact_' . md5($_SERVER['REMOTE_ADDR'] ?? 'inconnu');
if (file_exists($empreinte) && (time() - filemtime($empreinte)) < 30) {
    retour('erreur=frequence');
}
@touch($empreinte);

// ── Fabrique des mails ────────────────────────────────────────────────

/**
 * Enveloppe un contenu dans la charte du portfolio : bandeau noir, titre or,
 * corps clair et lisible. Tout est en style en ligne, seule façon fiable
 * d'être rendu correctement par les messageries.
 */
function gabarit($titre, $corps, $piedDePage)
{
    return '<!doctype html>
<html lang="fr"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>' . h($titre) . '</title></head>
<body style="margin:0;padding:0;background-color:#f2f1ee;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f2f1ee;padding:28px 12px;">
<tr><td align="center">

  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background-color:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.07);">

    <tr><td style="background-color:#0d0d0d;padding:26px 32px;">
      <p style="margin:0;font-family:Georgia,\'Times New Roman\',serif;font-size:22px;letter-spacing:0.04em;color:#ffffff;">
        MERCIA<span style="color:#c9a84c;">.</span>
      </p>
      <p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#c9a84c;">
        Conceptrice Designer UI
      </p>
    </td></tr>

    <tr><td style="height:3px;background-color:#c9a84c;font-size:0;line-height:0;">&nbsp;</td></tr>

    <tr><td style="padding:32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#2b2b2b;">
      <h1 style="margin:0 0 18px;font-family:Georgia,\'Times New Roman\',serif;font-size:23px;font-weight:normal;color:#0d0d0d;">' . h($titre) . '</h1>
      ' . $corps . '
    </td></tr>

    <tr><td style="padding:20px 32px 26px;background-color:#faf9f7;border-top:1px solid #ecebe7;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#8a8a8a;">
      ' . $piedDePage . '
    </td></tr>

  </table>

</td></tr></table>
</body></html>';
}

/** Une ligne « libellé : valeur » dans le mail de notification. */
function ligne($libelle, $valeur)
{
    return '<tr>
      <td style="padding:11px 0;border-bottom:1px solid #ecebe7;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8a8a;width:34%;vertical-align:top;">' . h($libelle) . '</td>
      <td style="padding:11px 0;border-bottom:1px solid #ecebe7;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#2b2b2b;">' . $valeur . '</td>
    </tr>';
}

/** Assemble un mail multipart : version texte + version HTML. */
function envoyer($a, $sujet, $html, $texte, $de, $nomDe, $repondreA = null)
{
    $frontiere = 'mercia_' . bin2hex(random_bytes(8));

    $entetes = [
        'MIME-Version: 1.0',
        'Content-Type: multipart/alternative; boundary="' . $frontiere . '"',
        'From: ' . mb_encode_mimeheader($nomDe, 'UTF-8') . ' <' . $de . '>',
    ];
    if ($repondreA) {
        $entetes[] = 'Reply-To: ' . $repondreA;
    }

    $corps = "--$frontiere\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: 8bit\r\n\r\n"
        . $texte . "\r\n\r\n"
        . "--$frontiere\r\n"
        . "Content-Type: text/html; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: 8bit\r\n\r\n"
        . $html . "\r\n\r\n"
        . "--$frontiere--";

    return mail(
        $a,
        mb_encode_mimeheader($sujet, 'UTF-8'),
        $corps,
        implode("\r\n", $entetes),
        '-f' . $de
    );
}

// ── 1. Le mail que Mercia reçoit ──────────────────────────────────────

$messageHtml = nl2br(h($message));

$corpsNotif = '<p style="margin:0 0 20px;">Un message vient d\'arriver depuis le formulaire de contact.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">'
    . ligne('Nom', h($nom))
    . ligne('Email', '<a href="mailto:' . h($email) . '" style="color:#8a7327;">' . h($email) . '</a>')
    . ligne('Type de projet', h($service))
    . '</table>
<p style="margin:24px 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8a8a;">Message</p>
<div style="padding:18px 20px;background-color:#faf9f7;border-left:3px solid #c9a84c;border-radius:0 8px 8px 0;">' . $messageHtml . '</div>
<p style="margin:26px 0 0;">
  <a href="mailto:' . h($email) . '" style="display:inline-block;background-color:#0d0d0d;color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;padding:13px 26px;border-radius:8px;">Répondre à ' . h($nom) . '</a>
</p>';

$notifTexte = "Nouveau message depuis le portfolio\n\n"
    . "Nom : $nom\nEmail : $email\nType de projet : $service\n\nMessage :\n$message\n";

envoyer(
    $DESTINATAIRE,
    'Nouveau message de ' . $nom . ' - portfolio',
    gabarit('Nouveau message', $corpsNotif, 'Envoyé depuis le formulaire de <a href="' . $SITE . '" style="color:#8a8a8a;">portfolio-mercia.ikala-ni.fr</a>. Répondre à ce mail écrit directement à la personne.'),
    $notifTexte,
    $EXPEDITEUR,
    $NOM_EXPEDITEUR,
    $email
);

// ── 2. L'accusé de réception envoyé au visiteur ───────────────────────

$corpsAccuse = '<p style="margin:0 0 16px;">Bonjour ' . h($nom) . ',</p>
<p style="margin:0 0 16px;">J\'ai bien reçu votre message et je vous remercie de m\'avoir écrit. Je vous réponds sous 24 heures ouvrées.</p>
<p style="margin:0 0 22px;">Je travaille du lundi au vendredi : je ne suis disponible ni le week-end ni les jours fériés. Un message laissé vendredi soir trouve donc sa réponse le lundi.</p>

<p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#8a8a8a;">Votre message</p>
<div style="padding:18px 20px;background-color:#faf9f7;border-left:3px solid #c9a84c;border-radius:0 8px 8px 0;">' . $messageHtml . '</div>

<p style="margin:24px 0 0;">En attendant, vous pouvez parcourir mes réalisations :</p>
<p style="margin:14px 0 0;">
  <a href="' . $SITE . '/realisations.html" style="display:inline-block;background-color:#c9a84c;color:#0d0d0d;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;padding:13px 26px;border-radius:8px;">Voir mes réalisations</a>
</p>
<p style="margin:26px 0 0;">À très vite,<br><strong>Mercia RANDRIANOME</strong><br>Conceptrice designer UI</p>';

$accuseTexte = "Bonjour $nom,\n\n"
    . "J'ai bien recu votre message et je vous remercie de m'avoir ecrit. "
    . "Je vous reponds sous 24 heures ouvrees.\n\n"
    . "Je travaille du lundi au vendredi : je ne suis disponible ni le week-end ni les jours feries. "
    . "Un message laisse vendredi soir trouve donc sa reponse le lundi.\n\n"
    . "Votre message :\n$message\n\n"
    . "A tres vite,\nMercia RANDRIANOME\nConceptrice designer UI\n$SITE\n";

envoyer(
    $email,
    'Votre message est bien arrivé - Mercia RANDRIANOME',
    gabarit('Votre message est bien arrivé', $corpsAccuse, 'Ce message est automatique, mais vous pouvez y répondre : il arrive directement dans ma boîte. <a href="' . $SITE . '" style="color:#8a8a8a;">portfolio-mercia.ikala-ni.fr</a>'),
    $accuseTexte,
    $EXPEDITEUR,
    'Mercia RANDRIANOME',
    $DESTINATAIRE
);

retour('envoye=1');
