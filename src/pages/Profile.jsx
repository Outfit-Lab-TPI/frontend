import { useNavigate } from "react-router-dom";
import UserDataCard from "../components/profile/UserDataCard";
import OutfitsCard from "../components/profile/OutfitsCard";
import SubscriptionCard from "../components/profile/SubscriptionCard";
import { useAuth } from './../hooks/auth/useAuth'

function Profile() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col items-center justify-center p-4 gap-6 min-h-[calc(100vh-60px)]">
      <UserDataCard />

      <div className="w-full max-w-md md:max-w-4xl flex not-md:flex-col gap-6">
        
        {user.role === "USER" && 
          <OutfitsCard />
        }

        {(user.role === "USER" || user.role === "BRAND")  && 
          <SubscriptionCard />
        }

      </div>
    </div>
  );
}

export default Profile;
