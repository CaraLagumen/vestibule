import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit, OnDestroy {
  // enteredTitle = "";
  // enteredContent = "";
  // @Output() postCreated = new EventEmitter<Post>();
  form: FormGroup;
  mode = "create";
  private postId: string;
  post: Post;
  isLoading = false;
  imagePreview: string;
  private authStatusSub: Subscription;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => (this.isLoading = false));

    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
      }), //(START STATE, END STATE)
      content: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500)
        ]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        // this.post = this.postsService.getPost(this.postId);
        this.postsService.getPost(this.postId).subscribe(postData => {
          console.log(postData);
          this.isLoading = false;

          this.post = {
            id: postData.id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });

    // this.route.paramMap.subscribe((paramMap: ParamMap) => {
    //   if (paramMap.has("postId")) {
    //     this.mode = "edit";
    //     this.postId = paramMap.get("postId");
    //     this.isLoading = true;
    //     // this.post = this.postsService.getPost(this.postId);
    //     this.postsService.getPost(this.postId).subscribe(postData => {
    //       this.post = postData;
    //     });
    //     this.isLoading = false;
    //   } else {
    //     this.mode = "create";
    //     this.postId = null;
    //   }
    // });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0]; //AS CONVERTS TYPE
    const reader = new FileReader();

    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();

    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    // alert("post added");

    // if (form.invalid) {
    //   return;
    // }

    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;

    // const post: Post = {
    //   title: form.value.title,
    //   content: form.value.content
    // };

    // this.postCreated.emit(post);

    if (this.mode === "create") {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }

    this.form.reset();
  }

  // onSavePost(form: NgForm) {
  //   // alert("post added");
  //   if (form.invalid) {
  //     return;
  //   }

  //   this.isLoading = true;

  //   // const post: Post = {
  //   //   title: form.value.title,
  //   //   content: form.value.content
  //   // };

  //   // this.postCreated.emit(post);

  //   if (this.mode === "create") {
  //     this.postsService.addPost(form.value.title, form.value.content);
  //   } else {
  //     this.postsService.updatePost(
  //       this.postId,
  //       form.value.title,
  //       form.value.content
  //     );
  //   }

  //   form.resetForm();
  // }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
