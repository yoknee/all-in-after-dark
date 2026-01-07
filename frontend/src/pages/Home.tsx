import { useNavigate } from 'react-router-dom'
import { ArtDecoTop, CornerOrnament, CTAButton, ArtDecoLine } from '../components/ArtDecoElements'

export function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-dark-bg font-baskerville text-cream">
      {/* Hero Section */}
      <div className="min-h-screen bg-[rgba(13,8,5,1)] flex justify-center items-center p-0 relative overflow-hidden text-[rgba(13,8,5,1)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1)_0%,transparent_70%)] pointer-events-none"></div>
        
        <div className="max-w-[600px] w-full border-[3px] border-gold relative p-10 z-10 text-center" style={{ borderStyle: 'solid', borderWidth: '3px', borderColor: 'rgba(212, 175, 55, 1)', boxShadow: 'none', background: 'unset', backgroundImage: 'none', backgroundColor: 'unset' }}>
          {/* Inner border */}
          <div className="absolute top-[15px] left-[15px] right-[15px] bottom-[15px] border border-gold pointer-events-none opacity-50"></div>
          
          {/* Corner ornaments */}
          <CornerOrnament position="top-left" />
          <CornerOrnament position="top-right" />
          <CornerOrnament position="bottom-left" />
          <CornerOrnament position="bottom-right" />
          
          <ArtDecoTop />
          
          <div className="text-[12px] text-light-gold text-center tracking-widest uppercase my-5 font-normal">
            The Night Shift Collective Presents
          </div>
          
          <h1 className="font-playfair text-[32px] md:text-6xl font-black text-gold text-center my-5 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] tracking-wide leading-tight w-full">
            OFF DUTY PARENTS:<br />ALL IN AFTER DARK
          </h1>
          
          <div className="font-playfair text-2xl text-light-gold text-center italic my-4 tracking-wide">
            at The Hidden Door
          </div>
          
          <CTAButton onClick={() => navigate('/register')} className="my-5">
            Reserve Your Spot
          </CTAButton>
          
          <ArtDecoLine />
          
          <div className="text-center text-cream text-[15px] leading-relaxed my-7.5 px-5">
            Leave the carpool chaos behind and slip into something more comfortable—like a poker face. We're dealing you into an evening of high stakes, low inhibitions, and zero bedtime negotiations. Think casino tables, craft cocktails, and connections with parents you've been meaning to meet (but were too busy packing lunches to introduce yourself to). 
            <br /><br />
            <span className="text-gold font-bold">Babysitting included on-site</span>—because the house always wins when the kids are covered.
          </div>
          
          <div className="text-center my-10 text-cream text-[15px] leading-[2.2]">
            <div className="my-3">
              <span className="text-gold font-bold tracking-widest uppercase text-[13px]">When</span>
              <div className="mt-1.5 text-base block">Saturday, [Date TBD] • 7:00 PM - 9:30 PM</div>
            </div>
            <div className="my-3">
              <span className="text-gold font-bold tracking-widest uppercase text-[13px]">Where</span>
              <div className="mt-1.5 text-base block">The Senesh School<br />342 Smith St, Brooklyn, NY 11231</div>
            </div>
          </div>
          
          <div className="bg-[rgba(212,175,55,0.1)] border-2 border-gold p-5 my-7.5 text-center">
            <div className="text-gold text-xs tracking-widest uppercase mb-2.5">
              Password Required for Entry
            </div>
            <div className="font-playfair text-xl text-cream italic tracking-wide">
              [Revealed upon registration]
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[rgba(212,175,55,0.2)] to-[rgba(212,175,55,0.05)] border-2 border-gold p-7.5 my-10 text-center relative">
            <div className="bg-gold text-dark-brown-2 px-5 py-2 text-[11px] tracking-widest uppercase font-bold inline-block mb-4 shadow-[0_4px_15px_rgba(212,175,55,0.4)]">
              ⬥ Exclusive Event ⬥
            </div>
            
            <CTAButton onClick={() => navigate('/register')} className="my-7.5">
              Reserve Your Spot
            </CTAButton>
            
            <div className="text-xs text-light-gold italic mt-4 text-[13px] mb-4">
              First 10 RSVPs per grade receive special perks
            </div>
          </div>
          
          <div className="mt-7.5">
            <ArtDecoTop />
          </div>
        </div>
      </div>
      
      {/* Info Section */}
      <div className="bg-[rgba(13,8,5,1)] py-8 px-5 text-center">
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-playfair text-4xl text-gold mb-7.5 tracking-wide">
            What Awaits Behind the Door
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-12">
            <div className="p-5 border border-gold/30 bg-[rgba(212,175,55,0.05)]">
              <h3 className="font-playfair text-2xl text-gold mb-4">Casino Tables</h3>
              <p className="text-light-gold leading-relaxed text-sm">
                Professional dealers running authentic poker, blackjack, roulette, and craps. No real money lost—just dignity and bragging rights.
              </p>
            </div>
            
            <div className="p-5 border border-gold/30 bg-[rgba(212,175,55,0.05)]">
              <h3 className="font-playfair text-2xl text-gold mb-4">Make New Allies</h3>
              <p className="text-light-gold leading-relaxed text-sm">
                Speed introductions, strategic icebreakers, and color-coded mixing designed to connect you with parents beyond your usual circle.
              </p>
            </div>
            
            <div className="p-5 border border-gold/30 bg-[rgba(212,175,55,0.05)]">
              <h3 className="font-playfair text-2xl text-gold mb-4">Havdalah to Happy Hour</h3>
              <p className="text-light-gold leading-relaxed text-sm">
                We'll begin with an intimate havdalah ceremony featuring live piano, then transition seamlessly into the speakeasy revelry.
              </p>
            </div>
            
            <div className="p-5 border border-gold/30 bg-[rgba(212,175,55,0.05)]">
              <h3 className="font-playfair text-2xl text-gold mb-4">1920s Atmosphere</h3>
              <p className="text-light-gold leading-relaxed text-sm">
                Moody lighting, live jazz, signature cocktails, and vintage vibes. Dress code: optional fedoras, mandatory fun.
              </p>
            </div>
          </div>
          
          <div className="mt-15 w-full flex flex-col justify-center items-center gap-2" style={{ boxSizing: 'content-box', display: 'flex', flexDirection: 'column' }}>
            <CTAButton onClick={() => navigate('/register')}>
              Reserve Your Spot
            </CTAButton>
            <div className="text-xs text-light-gold italic mt-2.5">
              Questions? Contact [event coordinator email]
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

