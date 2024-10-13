import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  items: any[] = [];

  constructor(private itemService: ItemService) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.itemService.getItems().subscribe(data => {
      this.items = data;
    });
  }

  addItem() {
    const newItem = { name: 'New Item', description: 'Description' };
    this.itemService.addItem(newItem).subscribe(() => {
      this.loadItems();
    });
  }

  updateItem(item: any) {
    this.itemService.updateItem(item.id, item).subscribe(() => {
      this.loadItems();
    });
  }

  deleteItem(id: number) {
    this.itemService.deleteItem(id).subscribe(() => {
      this.loadItems();
    });
  }
}
