A simple blog app, backend and frontend are separate and communicate through RESTful APIs... I would like to focus on the idea that many frontends can communicate with a single backend, this means a website can look visually different but still share the same underlying server that performs all the business logic.

# Environment variables
There are few things that needs to be setup:
```
BACKEND_URL="http://localhost"
BACKEND_PORT=3000
DATABASE_URL="postgresql://username:password@host:port/db?schema=public"
JWT_SECRET="example secret here"
JWT_TOKEN_LIFETIME=600
ADMIN_USERNAME="user name of main admin"
```

I think everything except the first 2 variables is self-explanatory. As for BACKEND_URL and BACKEND_PORT, they are needed for frontends to fetch the correct APIs, so please do set them manually if you are not intending to try this locally.

# Database setup
I've used Prisma ORM as required by the project, this is the schema I'm using, could be more detailed but it does the job for now... most important is the relationships between the different tables:
```
model User {
    id          Int         @id @default(autoincrement())
    username    String      @unique @db.VarChar(32)
    password    String      @db.VarChar(64)
    firstName   String      @db.VarChar(32) @map("first_name")
    lastName    String      @db.VarChar(32) @map("last_name")
    createdAt   DateTime    @default(now()) @map("created_at")
    updatedAt   DateTime    @updatedAt @map("updated_at")
    isAdmin     Boolean     @default(false) @map("is_admin")
    posts       Post[]
    comments    Comment[]
}

model Post { 
    id          Int         @id @default(autoincrement()) 
    title       String
    content     String
    createdAt   DateTime    @default(now()) @map("created_at")
    updatedAt   DateTime    @updatedAt @map("updated_at")
    author      User        @relation(fields: [authorId], references: [id], onDelete: Cascade) 
    authorId    Int
    comments    Comment[]

    @@index([authorId])
}

model Comment {
    id          Int         @id @default(autoincrement())
    content     String
    createdAt   DateTime    @default(now()) @map("created_at")
    updatedAt   DateTime    @updatedAt @map("updated_at")
    author      User        @relation(fields: [authorId], references: [id], onDelete: Cascade) 
    authorId    Int
    post        Post        @relation(fields: [postId], references: [id], onDelete: Cascade) 
    postId      Int

    @@index([postId])
}
```

I mean dont get me wrong, I did not get it right the first time, there has been some.... "migrations" from my initial ideas...

# What can I say...
This probably the most exciting project in the odin series so far, the question of how frontend and backend are supposed to be separated has been in my mind for quite a long time, and I think I got a good first idea of how things work. As for the technologies used, really, this used most of the things you'd expect a modern site to have... database manipulation using an ORM, JWT authentication, RESTful APIs.. in backend, frontend uses the powerful React library with router. I might have forgot a few things here, but this will serve as an initial readme just fine.
