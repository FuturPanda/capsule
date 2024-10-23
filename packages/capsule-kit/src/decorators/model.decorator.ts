// import "reflect-metadata";

// type SchemaOptions = {
//   poolKey?: string;
// };

// type AttributeOptions = {
//   required?: boolean;
//   default?: any;
//   validate?: (value: any) => boolean;
// };

// type RelationType = "oneToOne" | "oneToMany" | "manyToOne" | "manyToMany";

// type RelationOptions = {
//   type: RelationType;
//   target: () => any;
//   inverseSide?: string;
// };

// // Metadata keys
// const SCHEMA_METADATA_KEY = Symbol("schema");
// const ATTRIBUTES_METADATA_KEY = Symbol("attributes");
// const RELATIONS_METADATA_KEY = Symbol("relations");

// // Decorators
// export function Schema(options: SchemaOptions = {}) {
//   return function (constructor: Function) {
//     Reflect.defineMetadata(SCHEMA_METADATA_KEY, options, constructor);
//   };
// }

// export function Attribute(options: AttributeOptions = {}) {
//   return function (target: any, propertyKey: string) {
//     const attributes =
//       Reflect.getMetadata(ATTRIBUTES_METADATA_KEY, target.constructor) || {};
//     attributes[propertyKey] = options;
//     Reflect.defineMetadata(
//       ATTRIBUTES_METADATA_KEY,
//       attributes,
//       target.constructor,
//     );
//   };
// }

// export function Relation(options: RelationOptions) {
//   return function (target: any, propertyKey: string) {
//     const relations =
//       Reflect.getMetadata(RELATIONS_METADATA_KEY, target.constructor) || {};
//     relations[propertyKey] = options;
//     Reflect.defineMetadata(
//       RELATIONS_METADATA_KEY,
//       relations,
//       target.constructor,
//     );
//   };
// }

// function transformString(transformer: (value: string) => string) {
//   return (target: undefined, context: ClassFieldDecoratorContext) => {
//     return function (this: any, value: string) {
//       return transformer(value);
//     };
//   };
// }

// const example = new Example();
// example.sayHello("World"); // Logs: Calling sayHello with ["World"]

// // ObjectPool class
// class ObjectPool {
//   private pool: Map<string, Map<string, any>> = new Map();

//   insert(instance: any): void {
//     const constructor = instance.constructor;
//     const schemaOptions: SchemaOptions = Reflect.getMetadata(
//       SCHEMA_METADATA_KEY,
//       constructor,
//     );

//     if (!schemaOptions) {
//       throw new Error(`Class ${constructor.name} is not a schema`);
//     }

//     const poolKey = schemaOptions.poolKey || constructor.name;
//     if (!this.pool.has(poolKey)) {
//       this.pool.set(poolKey, new Map());
//     }

//     const instancePool = this.pool.get(poolKey)!;
//     const id = this.generateId();

//     // Validate attributes
//     const attributes =
//       Reflect.getMetadata(ATTRIBUTES_METADATA_KEY, constructor) || {};
//     for (const [key, options] of Object.entries(attributes)) {
//       const value = instance[key];
//       if (options.required && value === undefined) {
//         throw new Error(`Attribute ${key} is required`);
//       }
//       if (options.validate && !options.validate(value)) {
//         throw new Error(`Validation failed for attribute ${key}`);
//       }
//       if (value === undefined && options.default !== undefined) {
//         instance[key] =
//           typeof options.default === "function"
//             ? options.default()
//             : options.default;
//       }
//     }

//     // Handle relations
//     const relations =
//       Reflect.getMetadata(RELATIONS_METADATA_KEY, constructor) || {};
//     for (const [key, options] of Object.entries(relations)) {
//       // Here you would implement the logic for handling different relation types
//       // This is a simplified example
//       if (options.type === "oneToOne" || options.type === "manyToOne") {
//         const relatedInstance = instance[key];
//         if (relatedInstance) {
//           this.insert(relatedInstance);
//         }
//       }
//     }

//     instancePool.set(id, instance);
//   }

//   private generateId(): string {
//     return Math.random().toString(36).substr(2, 9);
//   }

//   getPool(): Map<string, Map<string, any>> {
//     return this.pool;
//   }
// }

// // Usage example
// @Schema({ poolKey: "users" })
// class User {
//   @Attribute({ required: true })
//   name: string;

//   @Attribute({ validate: (value) => value >= 0 })
//   age: number;

//   @Relation({ type: "oneToMany", target: () => Post })
//   posts: Post[];

//   constructor(name: string, age: number) {
//     this.name = name;
//     this.age = age;
//     this.posts = [];
//   }
// }

// @Schema()
// class Post {
//   @Attribute({ required: true })
//   title: string;

//   @transformString((obj) => obj)
//   secondTitle: string = "";

//   @Relation({ type: "manyToOne", target: () => User })
//   author: User;

//   constructor(title: string, author: User) {
//     this.title = title;
//     this.author = author;
//   }
// }

// // Using the ObjectPool
// const pool = new ObjectPool();

// const user = new User("Alice", 30);
// const post = new Post("My First Post", user);

// pool.insert(user);
// pool.insert(post);

// console.log(pool.getPool());

// function loggedMethod(
//   originalMethod: any,
//   context: ClassMethodDecoratorContext,
// ) {
//   const methodName = String(context.name);

//   function replacementMethod(this: any, ...args: any[]) {
//     console.log(`LOG: Entering method '${methodName}'.`);
//     const result = originalMethod.call(this, ...args);
//     console.log(`LOG: Exiting method '${methodName}'.`);
//     return result;
//   }

//   return replacementMethod;
// }

// class Person {
//   name: string;
//   constructor(name: string) {
//     this.name = name;

//     this.greet = this.greet.bind(this);
//   }

//   @loggedMethod
//   greet() {
//     console.log(`Hello, my name is ${this.name}.`);
//   }
// }
