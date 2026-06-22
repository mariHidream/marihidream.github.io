import { movieService } from "@/src/api/movieService";
import UpcomingSection from "@components/features/main/UpcomingSection";
import AgeRatingBadge from "@components/ui/AgeRatingBadge";
import Link from "next/link";

export default async function MoviesPage () {
   
  const [allMovies, upcomingMovies] = await Promise.all([
    movieService.getNowPlaying(20),
    movieService.getUpcoming(10)
  ]);

  return (
    <div className="w-full max-w-[980px] mx-auto min-h-screen bg-slate-950 px-6 py-12">
        <div>
            <UpcomingSection movies={upcomingMovies} />        
        </div>
       
        <div>
            <h2 className="text-3xl font-black text-white mb-8">전체 상영작 목록 ({allMovies.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
                {allMovies.map((movie) => (
                <Link href={`/movies/${movie.id}`} key={movie.id} className="group">
                    <img src={movie.posterPath} alt={movie.title} className="aspect-[3/4] w-full rounded-2xl border border-slate-800 group-hover:border-slate-600 transition-all" />

                    <div className="flex items-center gap-3 mt-4">
                        <AgeRatingBadge rating={movie.ageRating} />
                        <h3 className="text-white font-bold truncate">{movie.title}</h3>
                    </div>
                    
                </Link>
                ))}
            </div>
        </div>
    </div>
  );
}