defmodule PlanIt.TripController do
  alias PlanIt.Repo
  import Ecto.Query

  use PlanIt.Web, :controller

  def index(conn, params) do

    user = 1

    trips = Repo.all(from t in PlanIt.Trip,
      where: t.user_id == ^user,
      select: [t.name, t.user_id])

    json conn, trips
  end


end
