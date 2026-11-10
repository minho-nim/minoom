# Third-party assets in minoom

Verified and downloaded from the publishers on 2026-11-10. These files are bundled locally: the app does not call an asset service or paid API at runtime.

| Asset | Creator / source | License | Used for |
|---|---|---|---|
| Modern Coffee Table 01 | Amin — https://polyhaven.com/a/modern_coffee_table_01 | CC0-1.0 | Starter living-room table |
| Modern Arm Chair 01 | Vibrant Nordic — https://polyhaven.com/a/modern_arm_chair_01 | CC0-1.0 | Lounge chair in the shared catalog |
| Wood Floor 050 | ambientCG — https://ambientcg.com/view?id=WoodFloor050 | CC0-1.0 | Wood floor |
| Fabric 030 | ambientCG — https://ambientcg.com/view?id=Fabric030 | CC0-1.0 | Sofa cushions and bedding |
| Tiles 107 | ambientCG — https://ambientcg.com/view?id=Tiles107 | CC0-1.0 | Bathroom floor |

License references: https://polyhaven.com/license and https://docs.ambientcg.com/license/ . CC0 text: https://creativecommons.org/publicdomain/zero/1.0/legalcode . Attribution is not required for these assets; names are retained for provenance. Powered by Poly Haven (offline preparation script uses its metadata API).

Preparation: 1K source maps, JPEG re-encoding (quality 85), embedded GLB buffers and textures, table width-axis alignment. Normal maps use OpenGL convention. No mesh decimation was needed for the approximately 5K / 9K-triangle models. Source glTF transforms, UVs, and materials remain intact except for the table alignment node. Thumbnails are rendered from the actual bundled models with Blender, not user photographs.

Rebuild with Python + Pillow: `python3 scripts/prepare-assets.py`. Render thumbnails with Blender: `blender -b --factory-startup --python scripts/render-previews.py`. Run preparation again after rendering to update the integrity manifest. Runtime Python/Blender dependencies are not required by the app. `public/assets/manifest.json` records SHA-256 and byte size for the packaged assets.

User uploaded photos and GLB files retain their own rights; their license is not inferred from this file. Photos are stored separately from `model` and `modelAsset`. Replacing a model retains the original furniture ID, photos, dimensions and all placements. `modelAsset.origin` records builtin / upload / reconstruction. The reconstruction origin is reserved for a future provider; no AI conversion endpoint has been added.
