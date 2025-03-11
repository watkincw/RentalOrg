import { Component, onCleanup, onMount, Show } from "solid-js";
import { Portal } from "solid-js/web";
// components
import LandlordDashboard from "../components/dashboards/LandlordDashboard";
import RenterDashboard from "../components/dashboards/RenterDashboard";
import PaginatedGlides from "../components/glides/PaginatedGlides";
import MainLayout from "../components/layouts/Main";
import Messenger from "../components/utils/Messenger";
import Button from "../components/utils/Button";
// hooks
import useGlides from "../hooks/useGlides";
import useUsers from "../hooks/useUsers";

const HomePage: Component = () => {
  const { user } = useUsers();
  const {
    store,
    addGlide,
    page,
    loadGlides,
    subscribeToGlides,
    unsubscribeFromGlides,
    displayNewGlides,
  } = useGlides();

  onMount(() => {
    console.log("keeping console.logs for now while testing app");
    console.log(`Is ${user?.fullName} a Renter? ` + user?.isRenter);
    console.log(`Is ${user?.fullName} a Landlord? ` + user?.isLandlord);
    subscribeToGlides();
  });

  onCleanup(() => {
    unsubscribeFromGlides();
  });

  return (
    <>
      <MainLayout
        onGlideAdded={addGlide}
        pageTitle="Home"
      >
        <Show when={user?.isLandlord}>
          <LandlordDashboard />
        </Show>
        <br />
        <Show when={user?.isRenter}>
          <RenterDashboard />
        </Show>
        <br />
        {/* Messenger functionality START */}
        {/* <div id="MessengerSection">
          <Messenger onGlideAdded={addGlide} />
          <div class="h-px bg-gray-700 my-1" />
          <Show when={store.newGlides.length >= 3}>
            <Portal>
              <div class="fixed top-2 z-100 left-2/4 -translate-x-1/2">
                <Button onClick={displayNewGlides}>
                  <span>Display New Glides</span>
                </Button>
              </div>
            </Portal>
          </Show>
          <PaginatedGlides
            page={page}
            pages={store.pages}
            loading={store.loading}
            loadMoreGlides={loadGlides}
          />
        </div> */}
        {/* Messenger functionality END */}
      </MainLayout>
    </>
  );
};

export default HomePage;
