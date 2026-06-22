import { movieService } from "@/src/api/movieService";
import BookingWizard from "@/src/components/features/booking/BookingWizard";


export default async function BookingPage() {
    const movies = await movieService.getNowPlaying();

    return (
      <div className="w-full min-h-screen bg-slate-950 py-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* 클라이언트 사이드 예매 상태 머신 컴포넌트 마운트 */}
          <BookingWizard movies={movies} />
        </div>
      </div>
    );
}