import {Component, OnInit} from '@angular/core';
import { Game } from 'src/app/models/game';
import {GameService} from "../../services/game.service";

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.css']
})
export class GamesListComponent implements OnInit{
favorites = false;
itemList: Game[] = [];
items: Game[] = [];
toast = {
  header: '',
  body: '',
  duration: 2000
}
toastShow = false;
  gameDelete: Game = {
    created_at: '',
    description: '',
    favorite: false,
    id: 0,
    image: '',
    subtitle: '',
    title: ''
  };

constructor(private gameService: GameService) {
}

  ngOnInit(): void {
  this.loadGames();
  }

  changeFavorite(item: any){
  item.favorite = !item.favorite;
  this.gameService.updateGame(item).subscribe(
    (data: any) => {
      if(item.favorite) {
        this.toast.body = 'Añadido a favoritos';
        this.toastShow = true;
        setTimeout(() => {this.toastShow = false}, 2000);
      } else {
        this.toast.body = 'Eliminado de favoritos';
        this.toastShow = true;
        setTimeout(() => {this.toastShow = false}, 2000);
      }
      this.loadFavorites();
    }
  )
  }

  favoriteList(){
  this.favorites = !this.favorites;
  this.loadFavorites();
  }

  search(event: any){
  this.itemList = this.items.filter(
    (item) => (item.title.toLowerCase().indexOf(event)>=0 ||
    item.subtitle.toLowerCase().indexOf(event)>=0 ||
    item.description.toLowerCase().indexOf(event)>=0)
  )
  }

  deleteGame(game: Game){
    if (game.id) this.gameService.deleteGame(game.id).subscribe(
      (data: any) => {
        this.toast.body = data.message;
        this.toastShow = true;
        setTimeout(() => {this.toastShow = false},2000);
        this.loadGames();
      }
    )
  }


  private loadGames() {
    this.gameService.getGames().subscribe(
      (datos: Game[]) => {
        this.itemList = datos;
        this.items = datos;
      }
    )
  }

  private loadFavorites() {
    if(this.favorites) {
      this.itemList = this.items.filter(
        (item) => item.favorite
      )
    } else this.itemList = this.items;
  }
}
