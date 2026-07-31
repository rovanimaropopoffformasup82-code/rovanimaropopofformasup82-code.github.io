#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
to-webp.py - Convertit des images (PNG, JPG) en WebP.

Pourquoi : le WebP pèse en général 25 à 70 % de moins que le PNG/JPG
pour une qualité identique. C'est une exigence d'éco-conception du portfolio.

Utilisation :
    python tools/to-webp.py                      -> convertit assets/images
    python tools/to-webp.py chemin/image.png     -> convertit un fichier
    python tools/to-webp.py chemin/dossier       -> convertit tout un dossier
    python tools/to-webp.py img.png --largeur 1600   -> redimensionne à 1600px de large max

Options :
    --largeur N   largeur maximale en px (garde les proportions, n'agrandit jamais)
    --qualite N   qualité WebP de 1 à 100 (defaut 82)
    --suffixe S   ajoute un suffixe au nom (ex: --suffixe -mobile -> image-mobile.webp)

Les fichiers d'origine ne sont JAMAIS supprimés.
"""

import sys
import os
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillow n'est pas installe. Lance : python -m pip install Pillow")
    sys.exit(1)

EXTENSIONS = {".png", ".jpg", ".jpeg"}


def humain(octets):
    for unite in ("o", "Ko", "Mo"):
        if octets < 1024:
            return f"{octets:.0f} {unite}"
        octets /= 1024
    return f"{octets:.1f} Go"


def convertir(source: Path, largeur=None, qualite=82, suffixe=""):
    try:
        img = Image.open(source)
    except Exception as e:
        print(f"  ignore {source.name} ({e})")
        return

    # Redimensionnement optionnel (jamais d'agrandissement)
    if largeur and img.width > largeur:
        ratio = largeur / img.width
        img = img.resize((largeur, round(img.height * ratio)), Image.LANCZOS)

    # Aplatit la transparence sur fond noir uniquement si le mode ne gere pas l'alpha en WebP
    if img.mode in ("P", "LA"):
        img = img.convert("RGBA")

    cible = source.with_name(source.stem + suffixe + ".webp")
    img.save(cible, "WEBP", quality=qualite, method=6)

    avant = source.stat().st_size
    apres = cible.stat().st_size
    gain = 100 - (apres / avant * 100) if avant else 0
    print(f"  {source.name}  {humain(avant)} -> {cible.name}  {humain(apres)}  (-{gain:.0f}%)")


def collecter(chemin: Path):
    if chemin.is_file():
        return [chemin] if chemin.suffix.lower() in EXTENSIONS else []
    if chemin.is_dir():
        return [p for p in sorted(chemin.rglob("*")) if p.suffix.lower() in EXTENSIONS]
    return []


def main():
    args = sys.argv[1:]
    largeur = None
    qualite = 82
    suffixe = ""
    cibles = []

    i = 0
    while i < len(args):
        a = args[i]
        if a == "--largeur":
            largeur = int(args[i + 1]); i += 2
        elif a == "--qualite":
            qualite = int(args[i + 1]); i += 2
        elif a == "--suffixe":
            suffixe = args[i + 1]; i += 2
        else:
            cibles.append(Path(a)); i += 1

    # Defaut : le dossier des images du portfolio
    if not cibles:
        racine = Path(__file__).resolve().parent.parent
        cibles = [racine / "assets" / "images"]

    fichiers = []
    for c in cibles:
        fichiers += collecter(c)

    if not fichiers:
        print("Aucune image PNG/JPG trouvee.")
        return

    print(f"Conversion de {len(fichiers)} image(s) en WebP (qualite {qualite}"
          + (f", largeur max {largeur}px" if largeur else "") + ") :")
    for f in fichiers:
        convertir(f, largeur, qualite, suffixe)
    print("Termine. Les fichiers d'origine sont conserves.")


if __name__ == "__main__":
    main()
