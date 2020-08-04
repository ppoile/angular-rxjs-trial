import { Component, OnInit } from '@angular/core';
import {
  from,
  of,
  Subject,
  timer,
} from 'rxjs';
import {
  concatMap,
  delay,
  map,
  switchMap,
  take,
} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-rxjs-trial';
  NUM_TESTRUNS_PER_CATEGORY = 3;

  constructor() {
    console.log('constructor()...');
  }

  ngOnInit() {
    console.log('ngOnInit()...');
    this.setupTestresultStream();
  }

  public onButtonClick() {
    console.log('onButtonClick()...');
  }

  private setupTestresultStream() {
    console.log('setupTestresultStream()...');
    const source = timer(0, 7000).pipe(
      map(i => i + 1),
      take(2),
    );
    const testresult$ = source.pipe(
      switchMap(
        (selectedJobId: number) => this.getCategoryAndDependencies(selectedJobId)
      ),
    );

    testresult$.subscribe();
  }

  private getCategoryAndDependencies(selectedJobId: number) {
    return of(selectedJobId).pipe(
      concatMap(
        (selectedJobId: number) => this.getCategory(selectedJobId)
      ),
      concatMap(
        (category: any) => this.getTestruns(category)
      ),
      concatMap(
        (testruns: any[]) => from(testruns)
      ),
      concatMap(
        (testrun: any) => this.getTestrunDependencies(testrun)
      ),
    );
  }

  private getCategory(selectedJobId: number) {
    console.log('getting category...', selectedJobId);
    const category = {
      id: selectedJobId,
      path: 'root/a/b/c',
    };
    return of(category).pipe(delay(1000));
  }

  private getTestruns(category: any) {
    console.log('getting testruns...', category);
    const baseTestrunId = category.id * 10;
    const testruns = [];
    for (let i = 0; i < this.NUM_TESTRUNS_PER_CATEGORY; i++) {
      const testrun = {
        id: baseTestrunId + i,
        name: `testrun-${baseTestrunId + i}`,
      };
      testruns.push(testrun);
    }
    return of(testruns).pipe(delay(1000));
  }

  private getTestrunDependencies(testrun: any) {
    return of(testrun).pipe(
      concatMap(
        (testrun: any) => this.getTestrunProperties(testrun)
      ),
      concatMap(
        (testrun: any) => this.getTestcaseOwners(testrun)
      ),
      concatMap(
        (testrun: any) => this.getTestrunMatrix(testrun)
      ),
    );
  }

  private getTestrunProperties(testrun: any) {
    console.log('getting testrun properties...', testrun);
    const properties = {
      git_commit: '<git-hash>',
    };
    testrun.properties = properties;
    return of(testrun).pipe(delay(1000));
  }

  private getTestcaseOwners(testrun: any) {
    console.log('getting testcase owners...', testrun);
    const owners = {
      testcase: 'a.b.c',
      owner: 'Sam Hawkins',
    };
    testrun.owners = owners;
    return of(testrun).pipe(delay(1000));
  }

  private getTestrunMatrix(testrun: any) {
    console.log('getting testrun matrix...', testrun);
    const matrix = {
      testsuite: 'a.b',
      testcases: [
        'c1',
        'c2',
        'c3',
        'c4',
      ],
    };
    testrun.matrix = matrix;
    return of(testrun).pipe(delay(1000));
  }
}
