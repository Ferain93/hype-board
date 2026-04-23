import { useVideos } from './hooks/useVideos';
import VideoGrid from './components/VideoGrid';
import Toast from './components/Toast';
import './App.css';

function App() {
  const { videos, loading, error } = useVideos();

  return (
    <div className="app">
      <header className="header">
        <h1>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tv-icon lucide-tv"><path d="m17 2-5 5-5-5"/><rect width="20" height="15" x="2" y="7" rx="2"/></svg> 
          Cartelera de Conocimiento
        </h1>
        <p>Los videos tech más hypados, filtrados y listos para ti</p>
      </header>

      <main className="main">
        {(loading || error) && (
          <div className="state-msg">
            <div className="spinner" />
            <span>Cargando videos...</span>
          </div>
        )}

        {error && (
          <Toast message="No pudimos traer los videos. Por favor, reintenta nuevamente en unos segundos." />
        )}

        {!loading && !error && <VideoGrid videos={videos} />}
      </main>
    </div>
  );
}

export default App;