import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

import createConnection from "../index";

async function create() {
  const connection = await createConnection();

  const id = uuidv4();
  const password = await hash("admin3", 8);

  await connection.query(
    `INSERT INTO USERS(id, name, email, password, "isAdmin", created_at, driver_license)
    values('${id}', 'admin3', 'admin@rentx.com.br', '${password}', true, 'now()', 'XXXXX')`,
  );

  await connection.close();
}

create().then(() => console.log("User admin created!"));
