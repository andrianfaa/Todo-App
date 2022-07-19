import { useAppSelector } from "app";
import { ActivityCard, Navbar } from "components";
import { AiOutlinePlus } from "react-icons/ai";
import { useGetActivitiesQuery } from "services";

function HomePage() {
  const { data, isLoading, error } = useGetActivitiesQuery();

  console.log(data);

  return (
    <div className="fade-in">
      <Navbar />
      <div className="container mx-auto p-6">
        <header>
          <section className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl lg:text-4xl">
              Activity
            </h1>

            <button type="button" className="button-base button-primary">
              <span>
                <AiOutlinePlus className="inline align-middle mr-2" />
                Add
              </span>
            </button>
          </section>
        </header>

        <main className="mt-6">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from([1, 2, 3, 4, 5]).map((num) => (
              <ActivityCard key={num} />
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
}

export default HomePage;
