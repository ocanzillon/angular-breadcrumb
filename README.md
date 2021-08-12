---
title: 'Breadcrumb in an Angular application'
description: 'Show a hierarchical breadcrumb in an Angular application'
date: 2021-01-24T21:45:48+00:00
author: Olivier Canzillon
main-class: 'angular'
permalink: /angular-breadcrumb
categories:
  - Angular
tags:
  - Angular

introduction: 'Show a hierarchical and dynamic breadcrumb in an Angular application configured in the route definition'
---

# Angular Breadcrumb application

An accessible application should contain a breadcrumb to help the user to navigate into the application. The best place to define the breadcrumb is the route definition. A hierarchical breadcrumb makes sense when the routes are defined in a tree manner. Depending on the activated route, the breadcrumb parts can be hardcoded strings or dynamically constructed from the content of the page.

## Architecture

The following elements are needed:

- the route definition where we add the breadcrumb parts
- a resolver if the breadcrumb part is defined dynamically
- a service responsible for constructing the breadcrumb hierarchy
- a component displaying the breadcrumb

## Route definition and resolver

The routes are defined as they would naturally be in an Angular application. We just add a `breadcrumb` property in the `data` object. This property can be a string (when the breadcrumb part is known in advance) or a function using the `data` object itself and returning a string (when the breadcrumb part is dynamically defined).

If the breadcrumb part is dynamic, a resolver must be set to retrieve the object used in the breadcrumb construction. This object will be also displayed on the corresponding page.

The breadcrumb is hierarchical if the route has some parent-children relationships, which is the case for the `/users` route in the example below.

```typescript
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, data: { breadcrumb: 'Home' } },
  {
    path: 'users',
    component: UserListComponent,
    data: { breadcrumb: 'Users' }, // hardcoded string
    children: [
      {
        path: ':id',
        component: UserComponent,
        data: { breadcrumb: (data: any) => `${data.user.name}` }, // dynamic
        resolve: { user: UserResolverService }, // resolver to retrieve the object used in the breadcrumb construction
      },
    ],
  },
];
```

## Service

The service subscribes to the router events (of type NavigationEnd) and constructs the breadcrumb hierarchy from the activated route, by following the route tree. For each node, a breadcrumb part is retrieved (either the hardcoded string, either the application of the function to the `data` object) and the URL of the page is constructed.

The result is an array of `Breadcrumb` elements exposed as an Observable.

```typescript
@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  // Subject emitting the breadcrumb hierarchy
  private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);

  // Observable exposing the breadcrumb hierarchy
  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

  constructor(private router: Router) {
    this.router.events.pipe(
      // Filter the NavigationEnd events as the breadcrumb is updated only when the route reaches its end
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(event => {
      // Construct the breadcrumb hierarchy
      const root = this.router.routerState.snapshot.root;
      const breadcrumbs: Breadcrumb[] = [];
      this.addBreadcrumb(root, [], breadcrumbs);

      // Emit the new hierarchy
      this._breadcrumbs$.next(breadcrumbs);
    });
  }

  private addBreadcrumb(route: ActivatedRouteSnapshot, parentUrl: string[], breadcrumbs: Breadcrumb[]) {
    if (route) {
      // Construct the route URL
      const routeUrl = parentUrl.concat(route.url.map(url => url.path));

      // Add an element for the current route part
      if (route.data.breadcrumb) {
        const breadcrumb = {
          label: this.getLabel(route.data),
          url: '/' + routeUrl.join('/')
        };
        breadcrumbs.push(breadcrumb);
      }

      // Add another element for the next route part
      this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
    }
  }

  private getLabel(data: Data) {
    // The breadcrumb can be defined as a static string or as a function to construct the breadcrumb element out of the route data
    return typeof data.breadcrumb === 'function' ? data.breadcrumb(data) : data.breadcrumb;
  }

}
```

## Component

The component subscribes to the Observable exposed by the service and displays the hierarchy to the user.

```typescript
@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
  breadcrumbs$: Observable<Breadcrumb[]>;

  constructor(private readonly breadcrumbService: BreadcrumbService) {
    this.breadcrumbs$ = breadcrumbService.breadcrumbs$;
  }
}
```

This implementation of the HTML part is really simple and can be customized with some CSS styles.

```html
<ul>
  <li *ngFor="let breadcrumb of (breadcrumbs$ | async)">
    <a [href]="breadcrumb.url">{{ breadcrumb.label }}</a>
  </li>
</ul>
```

## Code example

An example of a (really simple) working application can be browsed here: https://github.com/ocanzillon/angular-breadcrumb

![Demonstration](./demo.gif)
