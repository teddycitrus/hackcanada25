"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from 'next/link';

// const[chrt, setChrt] = useState(true);
// const[Op1, setOp1] = useState(false);
// const[Op2, setOp2] = useState(false);
// const[Op3, setOp3] = useState(false);
// const[patients, setPatients] = useState([]);

export default function Home() {

  return (
    <body> <div className="el"></div>
    <main>
      <section className = "min-h-screen flex flex-col">
        <h2 style={{ color: '#FFFFF0', fontSize: 75, marginBottom: 40, marginTop: 140}}>Simple, yet powerful.</h2>
        <p style={{ color: '#FFFFF0', fontSize: 20}}>An all-inclusive EHR agent for family physicians. Why spend 19 hours a week on administrative burdens?</p>
        <br></br>
        <div>
        <h2 className="mb-10"> </h2>
        </div>
        <Link href="/chart">
          <button>View Records</button>
        </Link>
        <Link href="/record" style={{ marginLeft: 20}}>
          <button>Add Record</button>
        </Link>
        <Link href="/plan" style={{ marginLeft: 20}}>
          <button>Plan a Treatment</button>
        </Link>
      </section>
    </main>
    </body>
  );
}
