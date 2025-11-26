// LOCAL IN-MEMORY USER DATABASE (no hashing)

export let users = [
    {
      id: "1",
      username: "Youssef Hashish",
      email: "yousef@example.com",
      phone: "01111111111",
      age: 24,
      gender: "male",
      password: "Youssef@1234"
    },
    {
      id: "2",
      username: "Yahya Ahmed",
      email: "yahya@example.com",
      phone: "01222222222",
      age: 25,
      gender: "male",
      password: "Yahya@1234"
    },
    {
      id: "3",
      username: "Ahmed Khalaf",
      email: "ahmed@example.com",
      phone: "01000000000",
      age: 23,
      gender: "male",
      password: "Ahmed@1234"
    }
  ];
  
  // CREATE NEW USER
  export function addUser({ username, email, password, phone, age, gender }) {
    const newUser = {
      id: String(users.length + 1),
      username,
      email,
      password,
      phone,
      age,
      gender,
    };
    users.push(newUser);
    return newUser;
  }
  
  // CHECK DUPLICATE: username OR email OR phone
  export function findDuplicate({ username, email, phone }) {
    return users.find(
      (u) =>
        u.username === username ||
        u.email === email ||
        u.phone === phone
    );
  }
  
  // FIND USER BY EMAIL (for login)
  export function findUser(email) {
    return users.find((u) => u.email === email);
  }
  