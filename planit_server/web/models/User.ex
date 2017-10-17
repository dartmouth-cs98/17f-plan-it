defmodule PlanIt.User do
  use PlanIt.Web, :model

  schema "user" do
    field :fname, :string
    field :lname, :string
    field :email, :string
    field :username, :string
    field :birthday, :datetime

    timestamps
  end
end
