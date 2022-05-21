import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {PopMovieItem, EWMovieItem, Screening} from "../movies";
import { EventService } from "../event.service";
//import {screen-button} from "../event/event.component";

@Component({
  selector: 'app-movie-card',
  templateUrl: './movieCard.component.html',
  styleUrls: ['./movieCard.component.scss']
})
export class MovieCardComponent implements OnInit {
  @Input() movie!: EWMovieItem|undefined;
  @Input() screening!: Screening|undefined;
  @Output() notify = new EventEmitter();

  show = false;
  selected = false;
  buttonSel = false
  constructor(
    private eventService: EventService
  ) {}

  onSelectCard(ewMovieItem: EWMovieItem) {
    this.selected = !this.selected;
    console.log(this.selected);
    if (this.selected == false) {
      this.eventService.removeMovieFromEvent(ewMovieItem);
    } else {
      this.eventService.addMovieToEvent(ewMovieItem);
    }
  }
  

  unixConvert(unix: string): string {
    let show = new Date(parseInt(unix) * 1e3).toISOString().substring(0, 23);
    let showTime = new Date(show).toString();;
    //console.log("showTime: " + showTime);
    let strDay = showTime.substring(0, 3);
    let date = new Date(show);
    let day = date.getDate();
    //let month = date.getMonth() + 1;
    let strMonth = showTime.substring(4, 7);
    //let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    let zminutes = minutes < 10 ? '0'+minutes : minutes;
    let strTime = hours + ':' + zminutes + ' ' + ampm;
    return `${strDay} ${strMonth} ${day} - ${strTime}`;
  }

  ngOnInit(): void {
  }

}
