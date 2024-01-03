import * as THREE from 'three';

class MyTextRenderer {
    constructor(app) {
        this.scene = app.scene;
        this.charactersPerRow = 16;
        this.characterWidth = 256 / 512;
        this.characterSpacing = 0.40;

        const textureLoader = new THREE.TextureLoader();
        this.spriteSheetTexture = textureLoader.load('t08g01/textures/sprite/fonteu.png', () => {
            this.spriteSheetTexture.magFilter = THREE.LinearFilter;
            this.spriteSheetTexture.minFilter = THREE.LinearMipmapLinearFilter;
        });
    }

    renderText(text, size) {
        let position = new THREE.Vector3(0, 0, 0);
        let group = new THREE.Group();
        if (!this.spriteSheetTexture) {
            console.log('Sprite sheet texture not loaded yet');
            return;
        }

        let xOffset = 0;

        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            const row = Math.floor(charCode / this.charactersPerRow);
            const col = charCode % this.charactersPerRow;

            const material = new THREE.SpriteMaterial({
                map: this.spriteSheetTexture.clone(),

            });

            let sprite = new THREE.Sprite(material);
            sprite.scale.set(size, size, 1);

            sprite.position.set(position.x, position.y, position.z + xOffset);

            sprite.material.map.offset.set(col / this.charactersPerRow, 1 - (row + 1) / this.charactersPerRow);
            sprite.material.map.repeat.set(1 / this.charactersPerRow, 1 / this.charactersPerRow);

            group.add(sprite);

            xOffset += this.characterWidth + this.characterSpacing;
        }
        return group;
    }
}

export { MyTextRenderer };
