import {
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import {
  of,
  timer,
  Subject,
} from 'rxjs';
import {
  delay,
  exhaustMap,
  flatMap,
  last,
  map,
  take,
  tap,
} from 'rxjs/operators';

import { Cube } from './cube';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  stepTimeInMsec = 250;
  cube: Cube;
  cubeValue: Number;
  source: any;
  progress: Number;

  ngOnInit() {
    this.cube = new Cube();
    this.resetProgress();
    this.setupStream();
    this.source.next();
  }

  private setupStream() {
    this.source = new Subject();
    this.source.pipe(
      exhaustMap(
        () => this.getCubeValueStream()
      ),
    ).subscribe();
  }

  private getCubeValueStream() {
    return of({}).pipe(
      flatMap(
        () => this.getProgressSpinnerStream()
      ),
      last(),
      map(i => this.cube.next()),
      tap(i => this.setCubeValue(i)),
      delay(this.stepTimeInMsec),
    );
  }

  private getProgressSpinnerStream() {
    return timer(0, this.stepTimeInMsec).pipe(
      take(2),
      tap(i => this.setProgress(i)),
    );
  }

  @HostListener('document:keydown.space', ['$event'])
  public onKeydown(event: KeyboardEvent) {
    this.source.next();
  }

  public onButtonClick() {
    this.source.next();
  }

  private setProgress(value) {
    return this.progress = value;
  }

  private resetProgress() {
    return this.setProgress(0);
  }

  private setCubeValue(value) {
    return this.cubeValue = value;
  }
}
