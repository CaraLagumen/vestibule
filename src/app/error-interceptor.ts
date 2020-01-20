import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";

import { ErrorComponent } from "./error/error.component";

@Injectable()
//LIKE MIDDLEWARE BUT FOR OUTGOING
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        // console.log(err);
        // alert(err.error.error.message);
        let errMsg = "An unknown error occured!";

        if (err.error.message) {
          errMsg = err.error.message;
        }
        this.dialog.open(ErrorComponent, { data: { message: errMsg } });

        return throwError(err);
      })
    );
  }
}
