import Head from "next/head";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React from "react";
import Timer from "../../components/timer";

export async function getServerSideProps({ params }) {
  const { did } = params;

  const res = await fetch(
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/api/dash"
      : "https://timerr.vercel.app/api/dash",
    {
      method: "POST",
      body: JSON.stringify({
        dashUUID: did,
      }),
      headers: {
        "Content-Type": "Application/Json",
      },
    }
  );

  const body = await res.json();

  return {
    props: body,
  };
}

export default function Dashboard(props) {
  const router = useRouter();

  const container = {
    init: { opacity: 0, y: 10 },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.48, 0.15, 0.25, 0.96],
        staggerChildren: 0.45,
      },
    },
  };

  const subContainer = {
    init: { opacity: 0, y: 5 },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.48, 0.15, 0.25, 0.96],
        staggerChildren: 0.5,
      },
    },
  };

  const item = {
    init: { opacity: 0, y: 5 },
    enter: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Head>
        <title>Timerr</title>
      </Head>

      {props.prisma[0] === undefined ? (
        <main className="absolute w-full h-full grid place-content-center">
          <motion.section
            variants={container}
            initial="init"
            animate="enter"
            className="rounded-lg shadow-xl px-7 py-3 flex flex-row space-x-10 items-center justify-center"
          >
            <h1 className="text-5xl">😔</h1>
            <div className="flex flex-col space-y-3">
              <h3 className="text-3xl">Uh oh!</h3>
              <p>
                Looks like the dashboard you tried to reach doesn't exist or has
                no more timers left!
              </p>
              <button
                onClick={() => router.push("/create")}
                className="focus:outline-none self-center justify-self-center rounded-lg border duration-500 transition-colors border-gray-200 hover:border-blue-500 hover:text-blue-500 px-4 py-2 2xl:w-1/3 xl:w-1/3 lg:w-1/3 md:w-1/3 w-2/3"
              >
                Create one &rarr;
              </button>
            </div>
          </motion.section>
        </main>
      ) : (
        <>
          {" "}
          <p className="absolute top-3 left-3 2xl:text-base xl:text-base lg:text-base md:text-sm sm:text-xs text-xs">
            {props.prisma[0].dash}
          </p>
          <main className="absolute w-full h-full flex flex-col justify-center items-center space-y-6">
            <motion.section
              className="flex flex-col justify-center items-center space-y-10"
              variants={container}
              initial="init"
              animate="enter"
            >
              <motion.header
                variants={subContainer}
                className="flex flex-col items-center"
              >
                <motion.h1 variants={item} className="text-6xl font-semibold">
                  Dashboard
                </motion.h1>
                <motion.p variants={item}>
                  Welcome to the dashboard, you can get started below to begin!
                </motion.p>
              </motion.header>
            </motion.section>

            {props.prisma.map((timer, i) => {
              return (
                <motion.section
                  key={i}
                  variants={container}
                  initial="init"
                  animate="enter"
                  className="2xl:w-1/3 xl:w-1/3 lg:w-1/2 md:w-1/2 sm:w-2/3 w-5/6 rounded-lg shadow-lg border border-gray-300"
                >
                  <Timer timer={timer} />
                </motion.section>
              );
            })}

            <motion.button
              variants={container}
              initial="init"
              animate="enter"
              className="2xl:w-1/4 xl:w-1/4 lg:w-1/3 md:w-1/3 w-1/2 transition-colors duration-300 border-gray-200 hover:border-blue-500 hover:text-blue-500 border p-5 rounded-md flex items-center justify-center shadow-md focus:outline-none"
              onClick={() => router.push(`/${props.prisma[0].dash}/create`)}
            >
              Create new &rarr;
            </motion.button>
          </main>
        </>
      )}
    </>
  );
}
