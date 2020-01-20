import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

import { Post } from "./post.model";
import { Router } from "@angular/router";
import { environment } from '../../environments/environment'

const BACKEND_URL = `${environment.apiUrl}/posts`;

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    // return [...this.posts];
    // this.http
    //   .get<{ message: string; posts: any }>("${BACKEND_URL}")
    //   .subscribe(postData => {
    //     //NO NEED TO UNSUBSCRIBE FROM AN HTTP OBSERVABLE
    //     this.posts = postData.posts;
    //     this.postsUpdated.next([...this.posts]);
    //   });

    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;

    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        `${BACKEND_URL}${queryParams}`
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostsData => {
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostsData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    // return { ...this.posts.find(post => post.id === id) };
    return this.http.get<{
      id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(`${BACKEND_URL}/${id}`);
  }

  addPost(title: string, content: string, image: File) {
    // const post: Post = { id: null, title, content };
    const postData = new FormData();

    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.http
      .post<{ message: string; post: Post }>(
        `${BACKEND_URL}`,
        // post
        postData
      )
      .subscribe(() => {
        // .subscribe(postData => {
        // console.log(postData.message);
        // const postId = postData.postId;
        // post.id = postId;

        // const post: Post = {
        //   id: postData.post.id,
        //   title,
        //   content,
        //   imagePath: postData.post.imagePath
        // };

        // this.posts.push(post);
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    // const post: Post = { id, title, content, imagePath };
    let postData: Post | FormData;

    if (typeof image === "object") {
      postData = new FormData();

      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = { id, title, content, imagePath: image, creator: null };
    }

    this.http
      .patch(`${BACKEND_URL}/${id}`, postData)
      .subscribe(() => {
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex(el => el.id === id);
        // const post: Post = {
        //   id,
        //   title,
        //   content,
        //   imagePath: ""
        // };

        // updatedPosts[oldPostIndex] = post;
        // this.posts = updatedPosts;
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    return this.http.delete(`${BACKEND_URL}/${postId}`);
    // .subscribe(
    //   () => {
    //     //FILTER OUT ENTRIES NOT DELETED AND CREATE NEW ARR
    //     const updatedPosts = this.posts.filter(post => post.id !== postId);

    //     this.posts = updatedPosts;
    //     this.postsUpdated.next([...this.posts]);
    //   },
    //   error => console.log(error)
    // );
  }
}
