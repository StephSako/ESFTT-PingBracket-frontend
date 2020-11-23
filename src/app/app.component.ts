import {Component, OnInit} from '@angular/core';
import {NgttTournament} from 'ng-tournament-tree';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public singleEliminationTournament: NgttTournament;
  public doubleEliminationTournament: NgttTournament;

  public renderedTree: 'se' | 'de' = 'de';

  constructor() {
  }

  ngOnInit(): void {
    this.doubleEliminationTournament = {
      rounds: [
        {
          type: 'Winnerbracket',
          matches: [
            {
              teams: [{name: 'Team  A', score: 1}, {name: 'Team  B', score: 2}]
            },
            {
              teams: [{name: 'Team  C', score: 1}, {name: 'Team  D', score: 2}]
            },
            {
              teams: [{name: 'Team  E', score: 1}, {name: 'Team  F', score: 2}]
            },
            {
              teams: [{name: 'Team  G', score: 1}, {name: 'Team  H', score: 2}]
            }
          ]
        },
        {
          type: 'Winnerbracket',
          matches: [
            {
              teams: [{name: 'Team  B', score: 1}, {name: 'Team  D', score: 2}]
            },
            {
              teams: [{name: 'Team  F', score: 1}, {name: 'Team  H', score: 2}]
            }
          ]
        },
        {
          type: 'Loserbracket',
          matches: [
            {
              teams: [{name: 'Team  A', score: 1}, {name: 'Team  C', score: 2}]
            },
            {
              teams: [{name: 'Team  E', score: 1}, {name: 'Team  G', score: 2}]
            }
          ]
        },
        {
          type: 'Loserbracket',
          matches: [
            {
              teams: [{name: 'Team  C', score: 1}, {name: 'Team  B', score: 2}]
            },
            {
              teams: [{name: 'Team  G', score: 1}, {name: 'Team  F', score: 2}]
            }
          ]
        },
        {
          type: 'Winnerbracket',
          matches: [
            {
              teams: [{name: 'Team  D', score: 1}, {name: 'Team  H', score: 2}]
            }
          ]
        },
        {
          type: 'Loserbracket',
          matches: [
            {
              teams: [{name: 'Team  B', score: 1}, {name: 'Team  F', score: 2}]
            }
          ]
        },
        {
          type: 'Loserbracket',
          matches: [
            {
              teams: [{name: 'Team  D', score: 1}, {name: 'Team  F', score: 2}]
            }
          ]
        },
        {
          type: 'Final',
          matches: [
            {
              teams: [
                {
                  name: 'Team  H',
                  score: 1
                },
                {
                  name: 'Team  F',
                  score: 2
                }
              ]
            }
          ]
        }
      ]
    };
    this.singleEliminationTournament = {
      rounds: [
        {
          type: 'Winnerbracket',
          matches: [
            {
              teams: [{name: 'Team  A', score: 1}, {name: 'Team  B', score: 2}]
            },
            {
              teams: [{name: 'Team  C', score: 1}, {name: 'Team  D', score: 2}]
            },
            {
              teams: [{name: 'Team  E', score: 1}, {name: 'Team  F', score: 2}]
            },
            {
              teams: [{name: 'Team  G', score: 1}, {name: 'Team  H', score: 2}]
            }, {
              teams: [{name: 'Team  A', score: 1}, {name: 'Team  B', score: 2}]
            },
            {
              teams: [{name: 'Team  C', score: 1}, {name: 'Team  D', score: 2}]
            },
            {
              teams: [{name: 'Team  E', score: 1}, {name: 'Team  F', score: 2}]
            },
            {
              teams: [{name: 'Team  G', score: 1}, {name: 'Team  H', score: 2}]
            }
          ]
        }, {
          type: 'Winnerbracket',
          matches: [
            {
              teams: [{name: 'Team  A', score: 1}, {name: 'Team  B', score: 2}]
            },
            {
              teams: [{name: 'Team  C', score: 1}, {name: 'Team  D', score: 2}]
            },
            {
              teams: [{name: 'Team  E', score: 1}, {name: 'Team  F', score: 2}]
            },
            {
              teams: [{name: 'Team  G', score: 1}, {name: 'Team  H', score: 2}]
            }
          ]
        },
        {
          type: 'Winnerbracket',
          matches: [
            {
              teams: [{name: 'Team  B', score: 1}, {name: 'Team  D', score: 2}]
            },
            {
              teams: [{name: 'Team  F', score: 1}, {name: 'Team  H', score: 2}]
            }
          ]
        },
        {
          type: 'Final',
          matches: [
            {
              teams: [
                {
                  name: 'Team  D',
                  score: 1
                },
                {
                  name: 'Team  H',
                  score: 2
                }
              ]
            },
            {
              teams: [
                {
                  name: 'Team  F',
                  score: 1
                },
                {
                  name: 'Team  B',
                  score: 2
                }
              ]
            }
          ]
        }
      ]
    };
  }

}
