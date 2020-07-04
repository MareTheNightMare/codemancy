import { Component, OnInit } from '@angular/core'
import { SocketService } from './services/socket.service'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  posts = []
  comments = []
  commentHidden = []
  visible = false
  id: number

  constructor(private socketService: SocketService, private http: HttpClient) {}

  ngOnInit() {

    this.http.get('http://localhost:3000/database').subscribe((result: any) => {
      this.posts = result.array
      this.posts.sort((n1,n2) => {
        if (n1.date > n2.date) {
            return 1;
        }
    
        if (n1.date < n2.date) {
            return -1;
        }
        return 0;
      });
      this.id = result.array.length
    })

    this.socketService
      .getPosts()
      .subscribe((data: any) => {
        this.posts.push(data)
        this.posts.sort((n1,n2) => {
          if (n1.date > n2.date) {
              return 1;
          }
      
          if (n1.date < n2.date) {
              return -1;
          }
          return 0;
        });
        this.commentHidden.push(false)
      });

      this.socketService
      .getComments()
      .subscribe((data: any) => {
        const post = this.posts.find((obj) => obj.id == data.id);
        post.comments.push(data.comment)
      });
  }

  makePost(postTitle: string, postContent: string, postDate: Date) {
    const post = {
      id: this.id++,
      title: postTitle,
      content: postContent,
      date: postDate,
      comments: this.comments
    }
    this.socketService.makePost(post)
  }

  showComments(id) {
    if (this.commentHidden[id]) {
      this.commentHidden[id] = false  
    } else {
      this.commentHidden[id] = true
    }
  }

  postComment(postId: number, postComment: string) {
    const comm = {
      id: postId,
      comment: postComment
    }
    this.socketService.postComment(comm)
  }
}
