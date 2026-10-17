# Portfolio background assets

Created with the built-in ImageGen tool using the four approved desktop previews as references. These are full opaque rectangular plates; the arrow and the foreground's lower-edge mask are implemented in CSS. Foreground cutouts remain separate. Partial overlap is intentional.

The PNG masters and lossless WebP delivery files share the `*-background-v3` names in this directory. No resizing, sharpening, smoothing, or other pixel editing was applied during WebP encoding. Actual native dimensions are 1850 × 850 for Radian, Prevaisor and Social Puppy, and 1848 × 851 for Doshi. Higher requested generation sizes were not returned; these are not 4K assets.

## Composition prompt set

Common brief: Extract the approved arrow's background into a full opaque rectangle corresponding to the original arrow bounding box, approximately x529–1650 and y180–695 on the 1672 × 941 reference. Preserve the existing background objects, logos, color palette, positions and relative sizes. Remove only the main foreground subject so it can be animated separately. Reconstruct the concealed area and extend the artwork into the corners outside the arrow. Do not bake an arrow shape, margins, page UI, labels, navigation, or thumbnails into the asset. Keep the original partial overlaps rather than removing background content to make space.

- **Radian:** Green identity card, black Radian card, large white standalone Radian mark immediately to the robot's left, angled black phone and dimensional plus symbols on the right. Preserve all of these objects. Fill behind the robot with matching lime material. Restore perfectly smooth matte surfaces without coarse grain, patchiness or embossing. Restore the phone's complete rounded lower end and continuous metal rim, placing green planes behind it. Final positioning pass moved the standalone white mark left and down, and raised the black card, to keep the lettering visible inside the shaft mask.
- **Prevaisor:** Glass facade and blue billboard at left, large white standalone cube symbol beside it, blue environment behind the hand and phone, black smartwatch and cyan modular blocks at right. Billboard text: “Prevaisor” and “The future of Building Ecosystems”. Preserve all logos and props. Final positioning pass moved the standalone cube down and slightly left, reduced it to 90%, and moved the watch slightly left to retain readability after arrow clipping.
- **Social Puppy:** Coral paw and script wordmark at upper left, tilted white website mockup below, “Design That Hits Different”, “Your App” phone, +1M badge and small portrait/social details. Preserve the takeaway cup, phone displaying a dog in pink sunglasses, and pastel hearts on the right. Remove only the purple-haired foreground woman and turquoise jacket. Fill the concealed area with matching pink-to-mint material; preserve the original overlap and all background objects.
- **Doshi:** Ivory monogram pattern, black arch and DOSHI wordmark at left, bronze folded materials and angled white Doshi card below, brunette model in sunglasses and cream blouse at right. Remove only the large foreground leather tote and handles. Final positioning pass lowered and reduced the standalone logo group and raised, reduced and shifted the business card left, keeping its lettering visible within the shaft and beside the tote.

## Final generated sources

Files retained in Codex's generated-images directory `01a14650-cfa1-7253-93be-15d4cf92f9ee`:

- Radian: `exec-5f411e7f-b597-4b0b-8dfc-37a9eb71b7f1.png`
- Prevaisor: `exec-b7ceb491-7439-40ae-b12d-de64c6fc092c.png`
- Social Puppy: `exec-fb9f473f-9539-4c59-b1df-213c593db81a.png`
- Doshi: `exec-5def9fc3-3e83-41dd-9fbd-8eb9b9a28b5a.png`

Consumers use only the workspace copies. Earlier transparent-arrow images and rejected generations are not the backgrounds referenced by the current component.
