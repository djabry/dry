import {Component, Input, OnInit} from '@angular/core';
import {Analysis} from './analysis';
import {EntityType} from 'aws-sdk/clients/comprehend';
import {AnalysisSections} from './analysis.sections';
import {AnalysisSection} from '../analysis-section/analysis.section';
import {TitleService} from '../title.service';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {

  entityTypes: EntityType[] = ['PERSON', 'LOCATION', 'DATE'];

  @Input()
  userAnalysisResults: Analysis[];

  sections: AnalysisSections[];

  searchTerm: string;

  constructor(private titleService: TitleService) { }

  ngOnInit() {
    const sections: AnalysisSections[] = [];
    for (const analysis of this.userAnalysisResults) {
      for (const entity of analysis.entities) {
        const sectionEntry: AnalysisSection = {entity, noteId: analysis.id};
        let existingSections = sections.find(s => s.entityType === entity.Type && s.text === entity.Text);
        if (!existingSections) {
          existingSections = {
            entityType: entity.Type,
            text: entity.Text,
            sections: []
          };
          sections.push(existingSections);
        }
        existingSections.sections.push(sectionEntry);
      }
    }

    this.sections = sections.sort((s1, s2) => s1.text.localeCompare(s2.text));
  }

  async setTitle() {
  }

}
