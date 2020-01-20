import { Component, OnInit, ElementRef, AfterViewInit } from "@angular/core";

import { AuthService } from "./auth/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, AfterViewInit {
  // storedPosts: Post[] = [];
  // onPostAdded(post) {
  //   this.storedPosts.push(post);
  // }

  constructor(
    private authService: AuthService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.authService.autoLoginUser();
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor =
      "#303030";
  }
}
