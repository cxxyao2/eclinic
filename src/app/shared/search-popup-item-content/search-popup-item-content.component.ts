import { Component, Input, OnInit } from '@angular/core';
import { ARTICLE_CONTENT } from '../search-popup-item/search-test-data';

@Component({
    selector: 'app-search-popup-item-content',
    imports: [],
    templateUrl: './search-popup-item-content.component.html',
    styleUrl: './search-popup-item-content.component.scss'
})
export class SearchPopupItemContentComponent implements OnInit {
  @Input() articleTitle?: string;
  articleContent = ARTICLE_CONTENT;

  ngOnInit(): void {
    console.log('xxx', this.articleContent);
  }
}
