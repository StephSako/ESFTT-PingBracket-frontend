import { Component, OnInit } from '@angular/core';
import { LogsService } from 'src/app/Service/logs.service';

@Component({
  selector: 'app-logs-tableau',
  templateUrl: './logs-tableau.component.html',
  styleUrls: ['./logs-tableau.component.scss']
})
export class LogsTableauComponent implements OnInit {
  public logs = [];

  constructor(private logsService: LogsService) { }

  ngOnInit(): void {
    this.logsService.getAll().subscribe((res) => {
      this.logs = res.map((log, i) => {
        return {
          position: i,
          logMessage: log
        };
      });
    });
  }

}
