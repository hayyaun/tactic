"""Vendor a pinned, integrity-verified subset of the official Three.js package."""

from __future__ import annotations

import base64
import hashlib
import io
import json
from pathlib import Path
import tarfile
import tempfile
from urllib.request import urlopen


ROOT = Path(__file__).resolve().parents[2]
VERSION = "0.186.1"
INTEGRITY = "sha512-blFeqb49wRCSGUGj7gtpfnSGHy2lwDk94RhUmS1c/hTby70kvChbWpkJ4Pm1390LqzzvTmzgXKHPEafJwCb8jA=="
TARBALL = f"https://registry.npmjs.org/three/-/three-{VERSION}.tgz"
FILES = (
    "build/three.module.js",
    "build/three.core.js",
    "examples/jsm/loaders/GLTFLoader.js",
    "examples/jsm/environments/RoomEnvironment.js",
    "examples/jsm/objects/Reflector.js",
    "examples/jsm/utils/BufferGeometryUtils.js",
    "examples/jsm/utils/SkeletonUtils.js",
    "LICENSE",
    "package.json",
)


def main() -> None:
    destination = ROOT / "demo/vendor/three"
    with tempfile.TemporaryDirectory(prefix="tactic-three-") as temp:
        archive_path = Path(temp) / f"three-{VERSION}.tgz"
        with urlopen(TARBALL, timeout=60) as response:
            archive_path.write_bytes(response.read())
        archive_bytes = archive_path.read_bytes()
        actual = "sha512-" + base64.b64encode(
            hashlib.sha512(archive_bytes).digest()
        ).decode("ascii")
        if actual != INTEGRITY:
            raise RuntimeError("The official package did not match its pinned integrity.")

        hashes = {}
        with tarfile.open(fileobj=io.BytesIO(archive_bytes), mode="r:gz") as archive:
            for relative in FILES:
                member = archive.getmember(f"package/{relative}")
                if not member.isfile():
                    raise RuntimeError(f"Expected regular package file: {relative}")
                stream = archive.extractfile(member)
                if stream is None:
                    raise RuntimeError(f"Could not read package file: {relative}")
                data = stream.read()
                path = destination / relative
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(data)
                hashes[relative] = hashlib.sha256(data).hexdigest()

        package = json.loads((destination / "package.json").read_text())
        if package["name"] != "three" or package["version"] != VERSION:
            raise RuntimeError("Unexpected package identity.")
        provenance = {
            "package": "three",
            "version": VERSION,
            "source": TARBALL,
            "integrity": INTEGRITY,
            "filesSha256": hashes,
            "note": "Official npm files, unchanged; no root dependencies installed.",
        }
        (destination / "provenance.json").write_text(
            json.dumps(provenance, indent=2) + "\n"
        )
        print(json.dumps({"version": VERSION, "vendoredFiles": list(hashes)}, indent=2))


if __name__ == "__main__":
    main()
