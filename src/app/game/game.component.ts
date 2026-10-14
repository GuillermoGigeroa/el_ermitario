import { Component } from '@angular/core';
import { FavoritesService } from '../shared/services/favorites.service';

class Item {
    image: string;
    text: string;
    constructor(image: string, text: string) {
        this.image = image;
        this.text = text;
    }
}

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
    standalone: false
})
export class GameComponent {
    items: Array<Item> = new Array<Item>();
    constructor(private favoritesService: FavoritesService) {
        this.generateObjects();
    }

    private generateObjects() {
        this.items.push(new Item('assets/images/1.png', 'Sticker 1'));
        this.items.push(new Item('assets/images/2.png', 'Sticker 2'));
        this.items.push(new Item('assets/images/3.png', 'Sticker 3'));
        this.items.push(new Item('assets/images/4.png', 'Sticker 4'));
        this.items.push(new Item('assets/images/5.png', 'Sticker 5'));
        this.items.push(new Item('assets/images/6.png', 'Sticker 6'));
        this.items.push(new Item('assets/images/7.png', 'Sticker 7'));
    }

    toggleFavorite(item: Item): void {
        const id = this.getItemId(item);
        this.favoritesService.toggleFavorite({
            id,
            type: 'sticker',
            image: item.image,
            text: item.text,
            timestamp: Date.now()
        });
    }

    isFavorite(item: Item): boolean {
        return this.favoritesService.isFavorite(this.getItemId(item));
    }

    private getItemId(item: Item): string {
        return `sticker-${item.image.replace(/[^a-zA-Z0-9]/g, '-')}`;
    }
}
