import indexBG from "./indexBG.png";

export default function Home() {
  return (
    <>
      <div
        className="relative flex h-[calc(100vh)] bg-cover bg-top  sm:bg-top"
        style={{
          backgroundImage: `url(${indexBG})`,
        }}
      >
        <div className=" absolute left-48 top-52">
          <p className=" text-8xl">Decode.</p>
          <p className=" mt-8 text-8xl">Invest.</p>
          <p className=" mt-8 text-8xl">Prosper.</p>
        </div>
      </div>
    </>
  );
}
