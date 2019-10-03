import { Spec } from '@hayspec/spec';
import { floatParser, stringParser } from '@rawmodel/parsers';
import { Model, prop } from '../../..';

const spec = new Spec();

spec.test('deeply serializes property data using strategies', (ctx) => {
  class Book extends Model {
    @prop({
      parser: { resolver: floatParser() },
    })
    id: number;
    @prop({
      parser: { resolver: stringParser() },
      serializable: ['output'],
    })
    title: string;
    @prop({
      parser: { resolver: stringParser() },
      serializable: ['input'],
    })
    description: string;
  }
  class User extends Model {
    @prop({
      parser: { resolver: floatParser() },
      serializable: ['output'],
    })
    id: number;
    @prop({
      parser: { resolver: stringParser() },
    })
    name: string;
    @prop({
      parser: { resolver: stringParser() },
      serializable: ['input'],
    })
    email: string;
    @prop({
      parser: { resolver: Book },
      serializable: ['output'],
    })
    book0: Book;
    @prop({
      parser: { resolver: Book },
    })
    book1: Book;
    @prop({
      parser: { array: true, resolver: Book },
      serializable: ['input'],
    })
    books: Book[];
  }
  const data = {
    id: 100,
    name: 'John',
    email: 'foo@bar.com',
    book0: {
      id: 200,
      title: 'Foo',
      description: 'Bar',
    },
    book1: null,
    books: [
      null,
      {
        id: 300,
        title: 'Baz',
        description: 'Zed',
      },
    ],
  };
  const user = new User(data);
  const json0 = user.serialize('output');
  const json1 = user.serialize('input');
  ctx.deepEqual(json0, {
    id: 100,
    book0: {
      title: 'Foo',
    },
  });
  ctx.deepEqual(json1, {
    email: 'foo@bar.com',
    books: [
      null,
      {
        description: 'Zed',
      }
    ],
  });
});

export default spec;
