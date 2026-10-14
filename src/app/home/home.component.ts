import { Component } from '@angular/core';
import { FavoritesService } from '../shared/services/favorites.service';

class Item {
    id: string;
    image: string;
    text: string;
    constructor(id: string, image: string, text: string) {
        this.id = id;
        this.image = image;
        this.text = text;
    }
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent {
    items: Array<Item> = new Array<Item>();
    constructor(private favoritesService: FavoritesService) {
        this.generateObjects();
    }

    private generateObjects() {
        this.items.push(new Item('sticker-1', 'assets/images/1.png', 'Sticker 1'));
        this.items.push(new Item('sticker-2', 'assets/images/2.png', 'Sticker 2'));
        this.items.push(new Item('sticker-3', 'assets/images/3.png', 'Sticker 3'));
        this.items.push(new Item('sticker-4', 'assets/images/4.png', 'Sticker 4'));
        this.items.push(new Item('sticker-5', 'assets/images/5.png', 'Sticker 5'));
        this.items.push(new Item('sticker-6', 'assets/images/6.png', 'Sticker 6'));
        this.items.push(new Item('sticker-7', 'assets/images/7.png', 'Sticker 7'));
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
