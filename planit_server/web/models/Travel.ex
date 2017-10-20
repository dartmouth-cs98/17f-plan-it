defmodule PlanIt.Travel do
  use Ecto.Schema

  @primary_key {:id, :id, autogenerate: true}
  schema "travel" do
    has_many :card_travel, PlanIt.CardTravel

    field :type, :string
	field :duration, :time

	timestamps()
   end
end
