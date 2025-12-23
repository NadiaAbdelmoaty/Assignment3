const { createGzip } = require("node:zlib");
const http = require("node:http");
const port = 3000;
const {
  readFileSync,
  createReadStream,
  createWriteStream,
} = require("node:fs");
const { resolve } = require("node:path");
const filePath1 = resolve("./user.txt");
const filePath2 = resolve("./user2.txt");
const filePath1json = resolve("./users.json");

// ########################  Part1  ########################
// [1]
function readstream(file) {
  const creatReadStream = createReadStream(file, { encoding: "utf-8" });
  creatReadStream.on("data", (chunck) => {
    console.log(chunck);
  });
}
// readstream(filePath)

// -------------------------------------
// [2]

function readAndWrite(filetoraed, filetowrite) {
  const creatReadStream = createReadStream(filetoraed, { encoding: "utf-8" });
  let dataToRead = ``;
  creatReadStream.on("data", (chunck) => {
    dataToRead += chunck;
    const creatWriteStream = createWriteStream(filetowrite, {
      encoding: "utf-8",
      flags: "a",
    });
    dataToWrite = ``;
    creatWriteStream.write(dataToRead);
  });
}
// readAndWrite(filePath1, filePath2)

// -------------------------------------
// [3]
function readZipWrite(fileToRead, FileToWrite) {
  const creatReadStream = createReadStream(fileToRead, { encoding: "utf-8" });
  const gzip = createGzip(fileToRead);
  const creatWriteStream = createWriteStream(FileToWrite, {
    encoding: "utf-8",
    flags: "a",
  });
  creatReadStream.pipe(gzip).pipe(creatWriteStream);
}
// readZipWrite(filePath1,filePath2)

// -------------------------------------

// ########################  Part2  ########################

// [1]
const server = http.createServer((req, res) => {
  const { method, url } = req;
  const userid = url.split("/")[2];

  // ============post ==================
  // search about no to have addesional data33333333333333
  if (method == "POST" && url == "/user") {
    let totalnewUser = ``;
    req.on("data", (chunck) => {
      totalnewUser += chunck;
    });
    req.on("end", () => {
      // let {id,name,pass,email,age}=totalnewUser
      let {id,name,pass,email,age} = JSON.parse(totalnewUser);
      const readfilestream = createReadStream(filePath1json, {
        encoding: "utf-8",
      });

      let dataFile = ``;
      readfilestream.on("data", (chunck) => {
        dataFile += chunck;
      });
      readfilestream.on("end", () => {
        const ParsedDataFile = JSON.parse(dataFile);
        // check the user
        const exsistes = ParsedDataFile.find((user) => {
          return user.email == {id,name,pass,email,age}.email;
        });
        if (exsistes) {
          res.writeHead(409, { "content-type": "application/json" });
          res.write(JSON.stringify({ message: "you are here alredy" }));
          return res.end();
        }
        ParsedDataFile.push({id,name,pass,email,age});

        let writeUpdates = createWriteStream(filePath1json);
        writeUpdates.write(JSON.stringify(ParsedDataFile));
        writeUpdates.end();

        res.writeHead(201, { "content-type": "application/json" });
        res.write(JSON.stringify({ message: "User added", ParsedDataFile }));
        res.end();
      });
    });
  }
  // ---------------------------------------------------------------------------------
  // [2]
  // ======================PATCH====================================
  if (method == "PATCH" && url.startsWith("/user/")) {
    let totalnewUser = ``;
    req.on("data", (chunck) => {
      totalnewUser += chunck;
    });

    req.on("end", () => {
      let ParsedtotalnewUser = JSON.parse(totalnewUser);
      const readfilestream = createReadStream(filePath1json, {
        encoding: "utf-8",
      });

      let dataFile = ``;
      readfilestream.on("data", (chunck) => {
        dataFile += chunck;
      });
      readfilestream.on("end", () => {
        const ParsedDataFile = JSON.parse(dataFile);
        // check the user
        const exsistes = ParsedDataFile.find((user) => {
          return user.id == userid;
        });

        if (!exsistes) {
          res.writeHead(409, { "content-type": "application/json" });
          res.write(JSON.stringify({ message: "you are not a user" }));
          return res.end();
        } else {
          exsistes.age = ParsedtotalnewUser.age;
        }

        let writeUpdates = createWriteStream(filePath1json);
        writeUpdates.write(JSON.stringify(ParsedDataFile));
        writeUpdates.end();

        res.writeHead(201, { "content-type": "application/json" });
        res.write(JSON.stringify({ message: "Updated......", ParsedDataFile }));
        res.end();
      });
    });
  }
  // -------------------------------------------------------------------
  // [3]
  // ======================DELETE====================================

  if (method == "DELETE" && url.startsWith("/user/")) {
    const readfilestream = createReadStream(filePath1json, {
      encoding: "utf-8",
    });

    let dataFile = ``;
    readfilestream.on("data", (chunck) => {
      dataFile += chunck;
    });
    readfilestream.on("end", () => {
      const ParsedDataFile = JSON.parse(dataFile);
      // check the user

      const userIndex = ParsedDataFile.findIndex((user) => {
        return user.id == userid;
      });

      // if not found
      if (!userIndex == -1) {
        res.writeHead(409, { "content-type": "application/json" });
        res.write(JSON.stringify({ message: "you are not a user" }));
        return res.end();
      } else {
        ParsedDataFile.splice(userIndex, 1);
      }

      let writeUpdates = createWriteStream(filePath1json);
      writeUpdates.write(JSON.stringify(ParsedDataFile));
      writeUpdates.end();

      res.writeHead(201, { "content-type": "application/json" });
      res.write(
        JSON.stringify({
          message: "User deleted successfully",
          ParsedDataFile,
        })
      );
      res.end();
    });
    // });
  }
  // --------------------------------------------------------------------
  // [4]
  // ======================GET All users ====================================
  if (method == "GET" && url == "/user") {
    const readfilestream = createReadStream(filePath1json, {
      encoding: "utf-8",
    });

    let dataFile = ``;
    readfilestream.on("data", (chunck) => {
      dataFile += chunck;
    });
    readfilestream.on("end", () => {
      const ParsedDataFile = JSON.parse(dataFile);

      res.writeHead(201, { "content-type": "application/json" });
      res.write(JSON.stringify({ message: "ALL Users", ParsedDataFile }));
      res.end();
    });
  }

  // --------------------------------------------------------
  // [5]
  // ====================== GET User by id ====================================

  if (method == "GET" && url.startsWith("/user/")) {
    const readfilestream = createReadStream(filePath1json, {
      encoding: "utf-8",
    });

    let dataFile = ``;
    readfilestream.on("data", (chunck) => {
      dataFile += chunck;
    });
    readfilestream.on("end", () => {
      const ParsedDataFile = JSON.parse(dataFile);
      // check the user

      const userdata = ParsedDataFile.find((user) => {
        return user.id == userid;
      });

      // if not found
      if (!userdata) {
        res.writeHead(409, { "content-type": "application/json" });
        res.write(JSON.stringify({ message: "you are not a user" }));
        return res.end();
      }

      let writeUpdates = createWriteStream(filePath1json);
      writeUpdates.write(JSON.stringify(ParsedDataFile));
      writeUpdates.end();

      res.writeHead(201, { "content-type": "application/json" });
      res.write(
        JSON.stringify({
          message: "User is",
          userdata,
        })
      );
      res.end();
    });
  }

});

server.listen(port, () => {
  console.log("hi");
});

server.on("error", (error) => {
  console.log("I'm busyyyy");
  console.log(error);
});
