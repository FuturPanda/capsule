// const fakeObjectGraph = {
//   __root__: {
//     pipes: [
//       {
//         define: {
//           data: {
//             name: "user",
//             type: "entity",
//             columns: [
//               {
//                 data: {
//                   name: "email",
//                   type: "text",
//                   autoIncrement: true,
//                   notNull: true,
//                   primaryKey: true,
//                 },
//               },
//             ],
//           },
//         },
//         save: {},
//       },
//     ],
//   },
// };

// const fakeObjectPool = [
//   {
//     pipeId: "p_1",
//     children: ["d_i"],
//   },
//   {
//     defineId: "def_1",
//     children: ["d_1", "s_1"],
//   },
//   {
//     saveId: "s_1",
//     children: [],
//   },
//   {
//     dataId: "d_1",
//     name: "user",
//     type: "entity",
//     children: ["d_2"],
//   },
//   {
//     dataId: "d_2",
//     name: "email",
//     type: "text",
//     autoIncrement: true,
//     notNull: true,
//     primaryKey: true,
//     children: [],
//   },
// ];
