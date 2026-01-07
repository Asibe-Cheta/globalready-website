import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import ProblemSection from '@/components/ProblemSection'
import SolutionSection from '@/components/SolutionSection'
import HowItWorks from '@/components/HowItWorks'
import Pricing from '@/components/Pricing'
import Disclaimer from '@/components/Disclaimer'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <HowItWorks />
      <Pricing />
      <Disclaimer />
      <Footer />
    </main>
  )
}
