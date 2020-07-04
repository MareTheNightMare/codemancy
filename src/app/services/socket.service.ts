import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import * as io from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private url = 'http://localhost:3000'
  private socket

  constructor() { 
    this.socket = io(this.url);
  }  

  public makePost(post) {
    this.socket.emit('new-post', post)
  }

  public getPosts = () => {
    return Observable.create((observer) => {
            this.socket.on('new-post', (post) => {
                observer.next(post)
            });
    });
  }

  public postComment(comment) {
    this.socket.emit('new-comment', comment)
  }

  public getComments = () => {
    return Observable.create((observer) => {
            this.socket.on('new-comment', (comment) => {
                observer.next(comment)
            });
    });
  }
}
