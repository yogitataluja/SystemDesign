const data={
  authors:[
    {
      id:"1",
      name:"J.K. Rowling",
      bookIds:["1", "3"]
    },
    {
      id:"2",
      name:"George R.R. Martin",
      bookIds:["2"]
    }
  ],
  books:[
    {
      id:"1",
      title:"Harry Potter and the Philosopher's Stone",
      publishedYear:1997,
      authorId:"1"
    },
    {
      id:"2",
      title:"A Game of Thrones",
      publishedYear:1996,
      authorId:"2"
    },
    {
      id:"3",
      title:"The Hobbit",
      publishedYear:1937,
      authorId:"1"
    }

  ]
}
 
 export const resolvers={
  // handle books of author
  Author:{
    books:(parent, args,context,info)=>{
      return data.books.filter(book=>book.authorId===parent.id)
    }
  }, 
  //handle author of book
  Book:{
    author:(parent)=>{
      return data.authors.find(author=>author.id===parent.authorId)
    }
  },
  Query:{
    authors:()=>{
      return data.authors

    },
    books:()=>{
      return data.books
    },
    language:()=>{
      return "English"
    }
  },
  Mutation:{
    addBook:(parent, args, context,info)=>{
      console.log(args, "args")
      const newBook={...args, id:data.books.length+1}
      data.books.push(newBook)
      // here we write our database query
      return newBook

    }
  }
}