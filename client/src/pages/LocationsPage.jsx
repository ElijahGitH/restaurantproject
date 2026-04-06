import SiteNavbar from "../components/SiteNavbar";
import "./SiteTheme.css";

function LocationsPage() {
  return (
    <div className="locations-page">
      <SiteNavbar />

      <div className="hero-image-location">
        <div className="hero-text">
          <h1 className="display-3">Locations</h1>
          <h4>Sun, flavor, and a seat waiting just for you.</h4>
        </div>
      </div>

      <section className="ourlocations">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4 col-12 location-box">
              <div className="location_card">
                <img
                  src="/WINTERSPRINGS.png"
                  className="card-img-top location-img"
                  alt="Winter Springs"
                />
                <br />
                <h2 className="display-5">
                  <u>WINTER SPRINGS</u>
                </h2>

                <p className="headline-text">ADDRESS:</p>
                <p>789 Sol Street, Sanford, FL 32771</p>

                <p className="headline-text">PHONE:</p>
                <p>(407) 555-0199</p>

                <p className="headline-text">HEAD MANAGER(S):</p>
                <p>Nicholas B. & Dylan J.</p>

                <br />
                {/*Description created by Generative AI*/}
                <p className="location-description">
                  Tucked into the heart of Winter Springs, our cozy corner brings
                  sunshine to every plate. Slow down, savor bold flavors, and
                  enjoy a relaxed atmosphere that feels like home.
                </p>
              </div>
            </div>

            <div className="col-md-4 col-12 location-box">
              <div className="location_card">
                <img
                  src="/OVIEDO.png"
                  className="card-img-top location-img"
                  alt="Oviedo"
                />
                <br />
                <h2 className="display-5">
                  <u>OVIEDO</u>
                </h2>

                <p className="headline-text">ADDRESS:</p>
                <p>789 Sol Street, Sanford, FL 32771</p>

                <p className="headline-text">PHONE:</p>
                <p>(407) 555-0199</p>

                <p className="headline-text">HEAD MANAGER(S):</p>
                <p>Amber S. & Elijah R.</p>

                <br />
                {/*Description created by Generative AI*/}
                <p className="location-description">
                  Right near the heart of Oviedo, this spot is all about flavor
                  and good times. Whether you're grabbing a quick bite or meeting
                  up with friends, there's always something happening here.
                </p>
              </div>
            </div>

            <div className="col-md-4 col-12 location-box">
              <div className="location_card">
                <img
                  src="/SANFORD.png"
                  className="card-img-top location-img"
                  alt="Sanford"
                />
                <br />
                <h2 className="display-5">
                  <u>SANFORD</u>
                </h2>

                <p className="headline-text">ADDRESS:</p>
                <p>789 Sol Street, Sanford, FL 32771</p>

                <p className="headline-text">PHONE:</p>
                <p>(407) 555-0199</p>

                <p className="headline-text">HEAD MANAGER(S):</p>
                <p>Marco Y.</p>

                <br />
                {/*Description created by Generative AI*/}
                <p className="location-description">
                  In the charm of historic Sanford, Casa del Sol brings a
                  vibrant twist to classic flavors with a warm and elevated
                  dining experience.
                </p>
              </div>
            </div>
          </div>
        </div>
        <br />
      </section>
    </div>
  );
}

export default LocationsPage;
