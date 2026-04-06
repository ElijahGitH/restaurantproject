import SiteNavbar from "../components/SiteNavbar";
import "./SiteTheme.css";

function HomePage() {
  return (
    <>
      <SiteNavbar />

      <div className="hero-image">
        <div className="hero-text">
          <h1 className="display-1">~ Casa del Sol ~</h1>
          <h4>Sun-kissed flavor in every bite!</h4>
        </div>
      </div>

      <section className="story">
        <div className="container">
          <div className="row align-items-start">
            <div className="col-md-8 Story_Left">
              <div className="Story_Flavor">
                <br />
                {/*Descriptions created by Generative AI*/}
                <h2>
                  <u>FLAVOR, SUN, AND TRADITION</u>
                </h2>

                <p>
                  Welcome to Casa del Sol — where bold Mexican flavors meet a
                  vibrant, modern dining experience. Inspired by sun-soaked
                  streets, late-night tacos, and the heart of Latin culture, we
                  bring together authentic recipes and elevated presentation for
                  a meal you won’t forget.
                </p>

                <br />

                <p>
                  Every dish is crafted with intention, blending traditional
                  techniques with fresh ingredients and a contemporary twist.
                  From the first bite to the last sip, Casa del Sol is more than
                  a restaurant — it’s a place to gather, celebrate, and
                  experience the energy, warmth, and richness of Mexican
                  cuisine.
                </p>
              </div>
            </div>

            <div className="col-md-4 Story_Right">
              <div className="CDS_Hours">
                <br />
                <h2>
                  <u>HOURS</u>
                </h2>

                <p>
                  <strong>Monday – Friday:</strong> 11:00 AM – 11:00 PM
                </p>
                <p>
                  <strong>Saturday:</strong> 10:00 AM – 12:00 AM
                </p>
                <p>
                  <strong>Sunday:</strong> 10:00 AM – 10:00 PM
                </p>

                <br />

                <p>
                  <em>*All locations operate on these hours.</em>
                </p>
              </div>
            </div>
          </div>
        </div>
        <br />
      </section>
    </>
  );
}

export default HomePage;
