import { Injectable, inject, signal, computed } from '@angular/core';
import { DataService } from '../data/data.service';
import { Project, Profile, SkillGroup } from '../models/portfolio.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PortfolioStateService {
  private dataService = inject(DataService);

  // Real-time Signal for Profile
  profile = toSignal(this.dataService.getDoc<Profile>('about', 'profile'));

  // Real-time Signal for Skills
  skills = toSignal(this.dataService.getCollection<SkillGroup>('skills'), { initialValue: [] });

  // Incremental Projects Handling
  private loadedProjects = signal<Project[]>([]);
  projects = computed(() => this.loadedProjects());

  isLoadingProjects = signal(false);
  hasMoreProjects = signal(true);
  private lastProjectDoc: any = null;
  private PAGE_SIZE = 3;

  constructor() {
    this.loadMoreProjects(); // Load first batch
  }

  loadMoreProjects() {
    if (this.isLoadingProjects() || !this.hasMoreProjects()) return;

    this.isLoadingProjects.set(true);

    // We'll use a one-time fetch or a stream for the first batch?
    // For incremental, a one-time fetch often works better than nested observables.
    this.dataService
      .getProjectsPaginated(this.PAGE_SIZE, this.lastProjectDoc)
      .pipe(
        tap((newBatch) => {
          if (newBatch.length < this.PAGE_SIZE) {
            this.hasMoreProjects.set(false);
          }
          this.loadedProjects.update((current) => [...current, ...newBatch]);
          this.isLoadingProjects.set(false);
        })
      )
      .subscribe();
  }
}
