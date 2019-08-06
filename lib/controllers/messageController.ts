import { Request, Response, NextFunction } from 'express';
import Message from '../models/message';

export const createMessage = (req: Request, res: Response) => {
  let newMessage = new Message(req.body);

  newMessage.save((err, message) => {
    if (err) {
      res.status(400).send(err);
    }
    res.status(200).send({
      status: 200,
      message
    });
  });
}