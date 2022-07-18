import { useSearchQuery } from "hooks";
import { BiLoaderAlt } from "react-icons/bi";
import { IoCheckmarkCircleSharp, IoCloseCircleSharp } from "react-icons/io5";
import { useVerifyQuery } from "services";

type VerifyEmailLocationType = {
  email: string;
  token: string;
};

type ErrorType = {
  status?: number;
  data?: HttpResponse<unknown>;
}

function VerifyEmailPage() {
  const route = useSearchQuery<VerifyEmailLocationType>();
  const email = route.get("email");
  const token = route.get("token");

  const {
    data, isLoading, isError, isSuccess, error,
  } = useVerifyQuery({
    email: email || "",
    token: token || "",
  }, {
    skip: !email || !token,
  });

  const verifyError = error as ErrorType;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6">
      {isLoading ? (
        <div className="text-center">
          <BiLoaderAlt className="text-primary text-6xl animate-spin inline mb-2" />

          <h2 className="modal-title">Verifying...</h2>
          <p>Verifying your email address...</p>
        </div>
      ) : (
        <div className="text-center">
          {isError && error && (
            <div>
              <h2 className="modal-title">
                <IoCloseCircleSharp className="text-red-500 text-6xl inline mb-2" title="Error Icon" />
                <br />
                Verification Failed
              </h2>

              <p>{verifyError?.data?.message as string ?? "Please try again or contact support."}</p>
            </div>
          )}

          {isSuccess && (
            <div>
              <h2 className="modal-title">
                <IoCheckmarkCircleSharp className="text-green-500 text-6xl inline mb-2" title="Error Icon" />
                <br />
                Verification Successful
              </h2>

              <p className="mb-4">
                {data.message || "You can now login to your account."}
              </p>
            </div>
          )}
        </div>
      )}

      {(!email || !token) && (
        <div className="text-center">
          <h2 className="modal-title">
            <IoCloseCircleSharp className="text-red-500 text-6xl inline mb-2" title="Error Icon" />
            <br />
            Verification Failed
          </h2>

          <p className="mb-4">Either your email or token is invalid.</p>
        </div>
      )}
    </div>
  );
}

export default VerifyEmailPage;
