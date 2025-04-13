import { Component, Input, input } from '@angular/core';
import { SearchPopupItemContentComponent } from "../search-popup-item-content/search-popup-item-content.component";

@Component({
    selector: 'app-search-popup-item',
    imports: [SearchPopupItemContentComponent],
    templateUrl: './search-popup-item.component.html',
    styleUrl: './search-popup-item.component.scss'
})
export class SearchPopupItemComponent {

  @Input({ required: true }) articleTitle: string = "";
}
