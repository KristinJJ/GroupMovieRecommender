import {Component} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { ApicallService } from '../apicall.service';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MovieItem, movielist, PopMovieItem } from '../movies';
import { environment } from 'src/environments/environment';
import { MovieEvent } from '../event/event.component';
import { ActivatedRoute } from '@angular/router';
import { RankingService } from '../ranking.service';

/**
 * @title Drag&Drop custom preview
 */
@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})

export class RankingComponent implements OnInit {
  event: MovieEvent | undefined;
  id = '';
  eventTitle = '';
  eventDate = '';
  title = 'Movie ranking';
  movieItemArray: (MovieItem) [] | undefined;
  value = '';
  userID = 'No User ID Entered';
  errorMsg = '';
  movieRankings = new Map();
  highestRank = 'no highest rank';
  movieEvent: MovieEvent | undefined;
  url = 'http://localhost:4200/ranking/';

  constructor(public apicall: ApicallService, private rankingService: RankingService, private router: Router, private route: ActivatedRoute,) {
  }

  ngOnInit() {
    // First get the event id from the current route.
    const routeParams = this.route.snapshot.paramMap;
    const eventIDFromRoute = String(routeParams.get('eventID'));
    console.log("eventIDFromRoute: " + eventIDFromRoute);

    // Find the event that correspond with the id provided in route.
    this.movieEvent = JSON.parse(JSON.stringify(this.rankingService.getMovieEventByEventID(eventIDFromRoute)));
    //this.movieEvent = this.rankingService.getMovieEventByEventID(eventIDFromRoute);
    console.log("movieEvent: " + JSON.stringify(this.movieEvent));
    this.loadMoviesFromEvent();
  }

  loadMoviesFromEvent() {
    // if movieEvent is not undefined or null, assign movies to movieItemArray
    if (this.movieEvent != undefined) {
      this.eventTitle = this.movieEvent.eventTitle;
      this.eventDate = this.movieEvent.eventDate;
      this.movieItemArray = this.movieEvent.eventMovies;
      if (this.movieEvent.id) {
        this.id = this.movieEvent.id;
        this.url = this.url + this.id;
      }
    }
  }

  drop(event: CdkDragDrop<{ title: string, image: string }[]>) {
    if (this.movieItemArray) {
    moveItemInArray(this.movieItemArray, event.previousIndex, event.currentIndex);
    }
  }

  submitUserID() {
    if (this.value == '') {
      this.errorMsg = 'You must enter a User ID.';
      return;
    } else {
      this.userID = this.value;
      this.errorMsg = '';
    }
    console.log("User ID: " + this.userID);
  }

  rankMovies() {
    if (this.movieItemArray) {
      let points = this.movieItemArray.length
      for (let i = 0; i < this.movieItemArray.length; i++) {
        if (this.movieRankings.has(this.movieItemArray[i].title)) {
          let newRanking = points + this.movieRankings.get(this.movieItemArray[i].title)
          this.movieRankings.set(this.movieItemArray[i].title, newRanking);
          points--;
        } else {
          this.movieRankings.set(this.movieItemArray[i].title, points);
          points--;
        }
      }
    }
    this.findTopMovie();
  }

  findTopMovie() {
    let topMovie = '';
    let maxValue = 0;
    for (let key of this.movieRankings.keys()) {
      let newValue = this.movieRankings.get(key);
      if (newValue > maxValue) {
        maxValue = newValue;
        topMovie = key;
      }
    }
    this.highestRank = topMovie;
  }

  submitRanking() {
    if (this.userID == '' || this.userID == 'No User ID Entered') {
      this.errorMsg = 'You must enter a User ID.';
      return;
    }
    this.rankMovies();
    console.log("Highest rank: " + this.highestRank);

    console.log("User ID: " + this.userID);
    for (let entry of this.movieRankings.entries()) {
      console.log(entry[0], entry[1]);
    }
  }

}
