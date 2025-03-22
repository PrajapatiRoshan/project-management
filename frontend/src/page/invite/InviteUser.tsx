import { Loader } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { BASE_ROUTE } from '@/routes/common/routePaths';

const InviteUser = () => {
  //const navigate = useNavigate();
  const param = useParams();

  const inviteCode = param.inviteCode as string;

  const returnUrl = encodeURIComponent(
    `${BASE_ROUTE.INVITE_URL.replace(':inviteCode', inviteCode)}`
  );

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    //navigate(`/workspace/${data.workspaceId}`);
  };

  const isLoading = false;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Link to="/" className="flex items-center gap-2 self-center font-medium">
          <Logo />
          Roshan Prajapati
        </Link>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">
                Hey there! You're invited to join a Prajapati Workspace!
              </CardTitle>
              <CardDescription>
                Looks like you need to be logged into your Prajapati account to join this
                Workspace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Loader className="!w-11 !h-11 animate-spin place-self-center flex" />

              <div>
                <div className="flex items-center justify-center my-3">
                  <form onSubmit={handleSubmit}>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="!bg-green-500 !text-white text-[23px] !h-auto"
                    >
                      {isLoading && <Loader className="!w-6 !h-6 animate-spin" />}
                      Join the Workspace
                    </Button>
                  </form>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-2">
                  <Link
                    className="flex-1 text-base"
                    to={`/sign-up?returnUrl=${returnUrl}`}
                  >
                    <Button className="w-full">Signup</Button>
                  </Link>
                  <Link className="flex-1 text-base" to={`/?returnUrl=${returnUrl}`}>
                    <Button variant="secondary" className="w-full border">
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InviteUser;

